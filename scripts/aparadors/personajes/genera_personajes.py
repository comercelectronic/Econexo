"""Genera los personajes 3D de Aparadors BCN con Blender (sin servicios externos).

Cada personaje se modela con metaballs (cuerpo orgánico), se le añade esqueleto,
pesos, animaciones (reposo, andar, correr, hablar, saludar, señalar) y se exporta a GLB.
También renderiza una hoja de vistas (frente, 3/4, perfil, espalda) y un retrato.

Uso (desde D:\\Econexo):
  D:\\Tools\\blender-4.5.17-windows-x64\\blender.exe -b -P scripts/aparadors/personajes/genera_personajes.py -- [--solo lia,joan] [--sin-render]
"""
import bpy, bmesh, sys, math
from math import radians, sin, cos, pi
from mathutils import Vector, Quaternion, Matrix
from mathutils.bvhtree import BVHTree
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT_GLB = ROOT / 'public' / 'jocs' / 'aparadors-bcn' / 'personajes'
OUT_VIEWS = ROOT / 'scripts' / 'aparadors' / 'personajes' / 'vistas'
K = 0.575  # radio visible de un metaball aislado (rigidez 2, umbral 0.6)

# ---------------------------------------------------------------- reparto
CAST = {
    'lia': dict(nombre='Lía', h=1.64, female=True, belly=0.0, skin='#d8a27e', hair='#4a2a1c', hair_style='rizado', bun=True, eyes='#5b3a22',
                top='#efe6d6', sleeve=.62, vest=dict(kind='mosaic', cols=['#f2c13a', '#2f5fb3', '#e8edf2', '#e07b2c', '#3d8a5a']),
                scarf=['#a8352c', '#a8352c'], pants='#8f8070', shoes='#6b4126', sole='#3a2414', belt='#6b4228', toolbelt=True, earrings=True),
    'joan': dict(nombre='Joan', h=1.70, female=False, belly=0.022, skin='#e0b08f', hair='#d2cfc9', hair_style='canoso',
                 beard=True, eyes='#4a6a8a', top='#5c86a8', pants='#4b4540', shoes='#4a2f22', sole='#2b1d16',
                 belt='#2b1d16', sleeve=0.58, apron='#9c3b35'),
    'ada': dict(nombre='Ada', h=1.72, female=True, belly=0.0, skin='#8d5a3c', hair='#1d1a1c', hair_style='bob',
                eyes='#2a1a12', top='#46566e', under='#f5f5f2', pants='#46566e', shoes='#1f1f24', sole='#111114',
                belt='#1f1f24', sleeve=1.0, jacket=True, glasses='#b8a06a'),
    'laia': dict(nombre='Laia', h=1.68, female=True, belly=0.0, skin='#c68a64', hair='#2a1d17', hair_style='corto',
                 eyes='#3a2a1e', top='#2f5d50', under='#e9d8b8', pants='#2b2b30', shoes='#6b3e2a', sole='#2a1a12',
                 belt='#2a1a12', sleeve=1.0, jacket=True),
    'jan': dict(nombre='Jan', h=1.80, female=False, belly=0.0, skin='#f1c7a8', hair='#c9a050', hair_style='corto',
                eyes='#3d6d8c', top='#e9e4da', pants='#7d8a6a', shoes='#33302c', sole='#d8d2c4', belt='#4a3426',
                sleeve=0.58, glasses='#2a2a2a'),
    'nuria': dict(nombre='Núria', h=1.62, female=True, belly=0.008, skin='#f0c4a2', hair='#8a3b22', hair_style='mono',
                   eyes='#3f6b3a', top='#6e9e6a', pants='#6e9e6a', shoes='#7a4a32', sole='#4a2c1e', sleeve=0.32,
                   skirt='#6e9e6a', legs='#e8b896'),
    'nil': dict(nombre='Nil', h=1.78, female=False, belly=0.0, skin='#b37a55', hair='#2b2220', hair_style='gorra',
                  cap='#c0392b', eyes='#3a2a20', top='#6c4a9a', pants='#2d2f36', shoes='#e8e3d8', sole='#b02a2a',
                  sleeve=1.0, hood=True),
    # Vianants de Barcelona, fets a partir de les fitxes de referència (passer=True: sense full de vistes)
    'avi_barca': dict(nombre='Avi del Barça', passer=True, h=1.70, female=False, belly=.02, skin='#d9a07c', hair='#cfcac2', hair_style='rizado', beard=True, eyes='#4a3a2a',
                      hat='cap', hat_col='#1f2c6e', hat_col2='#a3203a', pat=dict(kind='vstripes', cols=['#a3203a', '#1f2c6e'], w=.045), top='#a3203a', sleeve=.45,
                      scarf=['#a3203a', '#1f2c6e'], fringe='#e2b23a', satchel=True, tied='#8a8468', pants='#3f4d6e', shoes='#2a3358', sole='#e8e2d6', paint=True),
    'forner': dict(nombre='Forner', passer=True, h=1.62, female=True, belly=.015, skin='#d6a688', hair='#8a8580', hair_style='mono', eyes='#4a3a2a',
                   hat='kerchief', hat_col='#e6d8c4', top='#e9dcc6', sleeve=.7, apron='#c9b79a', apron_long=True, pants='#4e4440', shoes='#5a4334', sole='#2e221a', earrings=True, towel=True),
    'music': dict(nombre='Music', passer=True, h=1.76, female=False, belly=0, skin='#c28b66', hair='#2a1d17', hair_style='rizado', beard=True, eyes='#2a1a10',
                  top='#e6dbc6', sleeve=.7, vest=dict(kind='solid', cols=['#2a2428']), scarf=['#9b2f45', '#6b3f8a'], guitar=True, pants='#4a3a34', shoes='#5a3a2a', sole='#e8e2d6', earrings=True),
    'llibreter': dict(nombre='Llibreter', passer=True, h=1.68, female=False, belly=.01, skin='#e4b896', hair='#d8d4cc', hair_style='canoso', glasses='#3a2e25', eyes='#4a3a2a',
                      hat='flatcap', hat_col='#6b5640', top='#a89270', jacket=True, under='#e9dfcc', sleeve=1.0, scarf=['#6e2a35', '#8e4a3e'], satchel=True, belt='#3a2618',
                      pants='#4a3a30', shoes='#6b4a30', sole='#2e2016'),
    'mosaicista': dict(nombre='Mosaicista', passer=True, h=1.72, female=False, belly=0, skin='#d0a07c', hair='#a9a49c', hair_style='rizado', beard=True, eyes='#4a3a2a',
                       hat='flatcap_goggles', hat_col='#6b5640', top='#e6dbc6', sleeve=.7, vest=dict(kind='mosaic', cols=['#4a3a30', '#2f5fb3', '#f2c13a', '#e8edf2', '#d9583f']),
                       toolbelt=True, belt='#5a3a22', pants='#6f6a66', shoes='#5a3a22', sole='#2e2016'),
    'florista': dict(nombre='Florista', passer=True, h=1.62, female=True, belly=.015, skin='#c99272', hair='#3a2418', hair_style='rizado', eyes='#3a2416',
                     hat='bandana', hat_col='#d9583f', pat=dict(kind='floral', cols=['#efe2c8', '#2f5fb3', '#d9583f', '#e6b23a']), top='#efe2c8', sleeve=.7,
                     apron='#5f6a4a', apron_long=True, pants='#5f6a4a', shoes='#e8e0d0', sole='#a3203a', basket=True, earrings=True),
    'taxista': dict(nombre='Taxista', passer=True, h=1.75, female=False, belly=.01, skin='#d29a78', hair='#5a5550', hair_style='rizado', sun_head=True, eyes='#3a2a20',
                    top='#26262a', yoke='#e2b23a', jacket=True, under='#d8d2c4', sleeve=1.0, pants='#3a3634', belt='#1a1a1a', shoes='#3a3a3e', sole='#c9c3b8', walkie=True),
    'vermut': dict(nombre='Cambrera', passer=True, h=1.65, female=True, belly=.01, skin='#c99272', hair='#2a1d17', hair_style='mono', eyes='#3a2416',
                   hat='bandana', hat_col='#a3302a', pat=dict(kind='vstripes', cols=['#e8d2c4', '#c9a8a0'], w=.02), top='#e8d2c4', sleeve=.7,
                   apron='#2e2e36', apron_long=True, pants='#5a5236', shoes='#5a3626', sole='#2e1a12', towel=True, earrings=True),
    'avia_mercat': dict(nombre='Avia del mercat', passer=True, h=1.55, female=True, belly=.03, skin='#e2b49a', hair='#b5b0a8', hair_style='mono', eyes='#5a6a7a',
                        top='#7a3a48', jacket=True, under='#e8d8c0', sleeve=1.0, scarf=['#e8d8c0', '#8a3a48'], satchel=True, netbag=True,
                        pants='#4a3e3a', shoes='#8a7458', sole='#e0d6c4', earrings=True),
    'pescador': dict(nombre='Pescador', passer=True, h=1.68, female=False, belly=.01, skin='#b07a55', hair='#bdb8b0', hair_style='corto', beard=True, eyes='#4a3a2a',
                     hat='beanie', hat_col='#23284a', top='#a89a7a', jacket=True, under='#2a3058', sleeve=.85, satchel=True, belt='#c9a96e',
                     pants='#4a4e6e', shoes='#3a3e50', sole='#c9a96e'),
    'music_jove': dict(nombre='Music jove', passer=True, h=1.78, female=False, belly=0, skin='#c99272', hair='#2a1d17', hair_style='rizado', eyes='#2a1a10',
                       hat='flatcap', hat_col='#5a4636', top='#d8ccb6', jacket=True, under='#f0e8da', sleeve=.8, scarf=['#a8352c', '#a8352c'], guitar=True, case_col='#4a2a26',
                       satchel=True, pants='#6e2e36', shoes='#2e2a2a', sole='#e8e2d6', earrings=True),
    'jove_barca': dict(nombre='Jove del Barca', passer=True, h=1.79, female=False, belly=0, skin='#d29a78', hair='#2a1d17', hair_style='rizado', eyes='#3a2a20',
                       pat=dict(kind='vstripes', cols=['#a3203a', '#1f2c6e'], w=.045), top='#a3203a', sleeve=.45, scarf=['#a3203a', '#1f2c6e'], fringe='#e2b23a',
                       tied='#232848', pants='#3f5480', shoes='#f2efe6', sole='#c9a96e', paint=True),
    'skater': dict(nombre='Skater', passer=True, h=1.80, female=False, belly=0, skin='#c99272', hair='#4a2e1e', hair_style='rizado', sun_head=True, eyes='#3a2a20',
                   pat=dict(kind='vstripes', cols=['#f2ece2', '#c9786e'], w=.03), top='#f2ece2', sleeve=.45, open=True, shorts=True, socks=True,
                   pants='#2e2e32', shoes='#232326', sole='#e8e2d6', skate=True),
    'merce': dict(nombre='Merce', passer=True, h=1.63, female=True, belly=.02, skin='#c99272', hair='#2a1d17', hair_style='rizado', bun=True, eyes='#3a2416',
                  hat='bandana', hat_col='#d9583f', pat=dict(kind='floral', cols=['#f2e6d2', '#ef8a1f', '#5a8a3a']), top='#f2e6d2', sleeve=.7,
                  apron='#8e2f2a', apron_long=True, pants='#2a2a2e', shoes='#4a4a4e', sole='#c9c3b8', earrings=True),
    'casteller': dict(nombre='Casteller', passer=True, h=1.75, female=False, belly=0, skin='#c99272', hair='#2a1d17', hair_style='corto', eyes='#3a2a20',
                      hat='mocador_cast', hat_col='#b8262a', top='#f4f2ee', sleeve=.75, pants='#f0eee8', sash='#1a1a1a', sash_fringe=True, shoes='#1a1a1a', sole='#c9a96e'),
}

# ---------------------------------------------------------------- utilidades

def lin(hexcol):
    h = hexcol.lstrip('#'); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1.0,)


def material(name, col, rough=0.8, metal=0.0, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = lin(col)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    return m


def quat_x_to(d):
    return Vector((1, 0, 0)).rotation_difference(d.normalized())


class Blobs:
    def __init__(self, name, h):
        self.mb = bpy.data.metaballs.new(name)
        self.mb.resolution = 0.011 * h; self.mb.render_resolution = 0.011 * h; self.mb.threshold = 0.6
        self.obj = bpy.data.objects.new(name, self.mb); bpy.context.scene.collection.objects.link(self.obj)
        self.h = h

    def ell(self, c, half, rot=None):
        h = self.h; half = [x * h for x in half]; R = max(half) / K
        e = self.mb.elements.new(type='ELLIPSOID'); e.co = Vector(c) * h; e.radius = R; e.stiffness = 2
        e.size_x, e.size_y, e.size_z = (x / (K * R) for x in half)
        if rot is not None: e.rotation = rot
        return e

    def ball(self, c, r):
        e = self.mb.elements.new(type='BALL'); e.co = Vector(c) * self.h; e.radius = r * self.h / K; e.stiffness = 2
        return e

    def limb(self, a, b, r):
        a, b = Vector(a), Vector(b); d = b - a
        e = self.mb.elements.new(type='CAPSULE'); e.co = (a + b) / 2 * self.h; e.radius = r * self.h / K
        e.stiffness = 2; e.size_x = d.length / 2 * self.h; e.rotation = quat_x_to(d)
        return e


def to_mesh(obj, name):
    bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True); bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target='MESH')
    m = bpy.context.view_layer.objects.active; m.name = name
    bm = bmesh.new(); bm.from_mesh(m.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.0005)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(m.data); bm.free()
    return m


def decimate(obj, target):
    n = len(obj.data.polygons)
    if n > target:
        bpy.context.view_layer.objects.active = obj
        mod = obj.modifiers.new('dec', 'DECIMATE'); mod.ratio = target / n
        bpy.ops.object.modifier_apply(modifier=mod.name)
    for p in obj.data.polygons: p.use_smooth = True


def prim(kind, loc, scale, rot=(0, 0, 0), seg=16):
    if kind == 'sphere': bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=max(6, seg // 2), location=loc)
    elif kind == 'torus': bpy.ops.mesh.primitive_torus_add(major_segments=20, minor_segments=6, major_radius=1, minor_radius=0.12, location=loc)
    elif kind == 'cube': bpy.ops.mesh.primitive_cube_add(location=loc)
    elif kind == 'cone': bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=1, radius2=0.7, depth=1, location=loc, end_fill_type='NOTHING')
    o = bpy.context.active_object; o.scale = scale; o.rotation_euler = rot
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    for p in o.data.polygons: p.use_smooth = kind != 'cube'
    return o

# ---------------------------------------------------------------- esqueleto (proporciones normalizadas a h=1)
ARM_DEG = 68


def joints(c):
    J = {'pelvis': (0, 0, .515), 'spine': (0, 0, .61), 'chest': (0, 0, .70), 'neck': (0, 0, .80), 'head': (0, 0, .85),
         'head_top': (0, 0, 1.0)}
    for s, k in ((1, 'L'), (-1, 'R')):
        sh = Vector((s * .158, .005, .778)); d = Vector((s * cos(radians(ARM_DEG)), 0, -sin(radians(ARM_DEG))))
        el = sh + d * .175; wr = el + d * .165; tip = wr + d * .10
        J.update({'clav' + k: (s * .03, 0, .79), 'shoulder' + k: tuple(sh), 'elbow' + k: tuple(el), 'wrist' + k: tuple(wr),
                  'tip' + k: tuple(tip), 'hip' + k: (s * .085, 0, .50), 'knee' + k: (s * .088, -.005, .275),
                  'ankle' + k: (s * .09, .01, .05), 'toe' + k: (s * .095, -.085, .012), 'armdir' + k: tuple(d)})
    return J


BONES = [  # nombre, cabeza, cola, padre
    ('hips', 'pelvis', 'spine', None), ('spine', 'spine', 'chest', 'hips'), ('chest', 'chest', 'neck', 'spine'),
    ('neck', 'neck', 'head', 'chest'), ('head', 'head', 'head_top', 'neck')]
for k in 'LR':
    BONES += [('clavicle.' + k, 'clav' + k, 'shoulder' + k, 'chest'), ('upper_arm.' + k, 'shoulder' + k, 'elbow' + k, 'clavicle.' + k),
              ('forearm.' + k, 'elbow' + k, 'wrist' + k, 'upper_arm.' + k), ('hand.' + k, 'wrist' + k, 'tip' + k, 'forearm.' + k),
              ('thigh.' + k, 'hip' + k, 'knee' + k, 'hips'), ('shin.' + k, 'knee' + k, 'ankle' + k, 'thigh.' + k),
              ('foot.' + k, 'ankle' + k, 'toe' + k, 'shin.' + k)]


def build_armature(J, h, name):
    arm = bpy.data.armatures.new(name + '_rig'); ob = bpy.data.objects.new(name + '_rig', arm)
    bpy.context.scene.collection.objects.link(ob); bpy.context.view_layer.objects.active = ob
    bpy.ops.object.mode_set(mode='EDIT')
    for n, a, b, p in BONES:
        e = arm.edit_bones.new(n); e.head = Vector(J[a]) * h; e.tail = Vector(J[b]) * h
        if p: e.parent = arm.edit_bones[p]
    bpy.ops.object.mode_set(mode='OBJECT')
    for pb in ob.pose.bones: pb.rotation_mode = 'QUATERNION'
    return ob

# ---------------------------------------------------------------- cuerpo


def build_body(c, J, name):
    h = c['h']; f = c['female']; bel = c['belly']
    B = Blobs('Cuerpo' + name.capitalize(), h)
    B.ell((0, 0, .50), (.112 if f else .102, .075, .07))
    B.ell((0, -.004 - bel * .6, .585), (.092 + bel, .07 + bel, .075 + bel * .5))
    B.ell((0, 0, .705), (.112 if f else .125, .078, .09))
    if f:
        for s in (-1, 1): B.ell((s * .045, -.052, .688), (.04, .035, .038))
    B.ell((0, .006, .755), (.142 if not f else .128, .056, .03))
    B.limb((0, .004, .77), (0, -.004, .86), .032 if not f else .028)
    B.ell((0, -.004, .915), (.068, .078, .088))           # cráneo
    B.ell((0, -.03, .87), (.05, .05, .04))                  # mandíbula
    B.ell((0, -.084, .905), (.012, .016, .02))              # nariz
    for s in (-1, 1): B.ell((s * .067, .006, .91), (.011, .02, .026))
    if c.get('hood'): B.ell((0, .06, .80), (.085, .045, .045))
    for k, s in (('L', 1), ('R', -1)):
        sh, el, wr, d = (Vector(J[x + k]) for x in ('shoulder', 'elbow', 'wrist', 'armdir'))
        B.ell(sh + Vector((-s * .014, 0, -.02)), (.032, .034, .028) if not f else (.028, .03, .025))
        B.limb(sh + d * .035, el, .035 if not f else .03); B.limb(el, wr, .028 if not f else .024)
        side = d.cross(Vector((0, 1, 0))).normalized(); q = Matrix((d, Vector((0, 1, 0)), side)).transposed().to_quaternion()
        B.ell(wr + d * .045, (.048, .04, .019), q)          # mano (manopla)
        a = wr + d * .02 + Vector((0, -.03, 0)); B.limb(a, a + d * .035 + Vector((0, -.018, 0)), .011)  # pulgar
        hp, kn, an = (Vector(J[x + k]) for x in ('hip', 'knee', 'ankle'))
        B.limb(hp, kn, .062 if f else .06); B.ell((hp + kn) / 2 + Vector((s * .006, -.004, .02)), (.058, .058, .09))
        B.limb(kn, an, .041); B.ell(kn + Vector((0, .016, -.075)), (.042, .045, .07))
        B.ell((s * .092, -.045, .032), (.046, .088, .036))   # zapato
    body = to_mesh(B.obj, name)
    decimate(body, 7000)
    return body


def raycast(bvh, origin, direction, maxd=None):
    loc, nor, i, d = bvh.ray_cast(Vector(origin), Vector(direction).normalized())
    if loc is not None and maxd is not None and d > maxd: return None
    return loc


def hair_blobs(c, body, name):
    h = c['h']; style = c['hair_style']
    dg = bpy.context.evaluated_depsgraph_get(); bvh = BVHTree.FromObject(body, dg)
    center = Vector((0, -.004, .915)) * h
    H = Blobs('Pelo' + name.capitalize(), h)
    thick = {'corto': .013, 'coleta': .011, 'bob': .016, 'mono': .012, 'canoso': .011, 'gorra': .010, 'boina': .010, 'mocador': .016, 'rizado': .02, 'calvo': .008}[style]
    for el in range(-80, 91, 9):
        for az in range(-180, 180, 10):
            e, a = radians(el), radians(az)
            d = Vector((cos(e) * sin(a), -cos(e) * cos(a), sin(e)))
            front = abs(az) < 72
            if style == 'bob':
                ok = (el >= 12 if front else el >= -40) and not (front and el < 40 and abs(az) < 20 and el < 22)
                ok = ok and not (abs(az) < 72 and el < 12)
            elif style == 'canoso':
                ok = (abs(az) > 80 and -12 <= el <= 28) or (abs(az) > 120 and el < 50)
            elif style == 'mocador':   # pañuelo: cubre cabeza, orejas y cuello, deja la cara
                ok = not (abs(az) < 58 and -48 < el < 36) and el >= -75
            elif style == 'calvo':
                ok = abs(az) > 95 and -10 <= el <= 12
            elif style == 'boina':
                ok = (not front and -12 <= el <= 22) or (front and abs(az) > 55 and 0 <= el <= 22)
            elif style == 'gorra':
                ok = (not front and -12 <= el <= 25) or (front and abs(az) > 55 and 0 <= el <= 25)
            else:
                ok = (el >= 30 - (8 if abs(az) > 45 else 0)) if front else (el >= (-14 if abs(az) > 110 else 4))
            hat = c.get('hat')
            if hat in ('cap', 'beanie', 'flatcap', 'flatcap_goggles') and el >= 18: ok = False      # sota el barret no hi ha cabell
            if hat in ('kerchief', 'mocador_cast') and (el >= 5 or abs(az) < 100): ok = False
            if not ok: continue
            p = raycast(bvh, center, d, .13 * h)
            if p is None: continue
            r = thick * (1.25 if el > 40 else 1.0)
            if style == 'rizado':   # rizos: bolas de tamaño irregular que sobresalen a distintas alturas
                k = ((el * 7 + az * 13) % 17) / 17; r *= .55 + .9 * k
                H.ball(p / h + d * thick * (.3 + 1.1 * k), r); continue
            H.ball(p / h + d * thick * .25, r)
    if style == 'coleta':
        top = raycast(bvh, center, Vector((0, .5, .35)))
        if top is not None:
            t = top / h; H.ball(t + Vector((0, .012, 0)), .02)
            for i, r in enumerate((.022, .024, .021, .016, .011)):
                H.ball(t + Vector((0, .028 + i * .012, -.02 - i * .03)), r)
    if style == 'mono':
        top = raycast(bvh, center, Vector((0, .6, .8)))
        if top is not None: H.ball(top / h + Vector((0, .02, .02)), .034)
    parts = []
    if len(H.mb.elements):
        hair = to_mesh(H.obj, name + '_pelo'); decimate(hair, 2500); parts.append((hair, 'hair', 'head'))
    if style == 'boina':
        top = raycast(bvh, center, Vector((0, .1, 1)))
        if top is not None:
            parts.append((prim('sphere', top + Vector((0, .006, .004)) * h, (.078 * h, .082 * h, .022 * h), seg=20), 'cap', 'head'))
    if c.get('beard'):
        Bd = Blobs('Barba' + name.capitalize(), h)
        for el in range(-80, -24, 7):
            for az in range(-105, 106, 9):
                e, a = radians(el), radians(az)
                d = Vector((cos(e) * sin(a), -cos(e) * cos(a), sin(e)))
                if el > -40 and abs(az) < 22: continue   # deja ver la boca
                p = raycast(bvh, center, d, .13 * h)
                if p is not None: Bd.ball(p / h + d * .003, .011)
        m = raycast(bvh, (0, -1, .888 * h), (0, 1, 0))
        if m is not None: Bd.ell(m / h + Vector((0, -.004, 0)), (.022, .006, .006))
        beard = to_mesh(Bd.obj, name + '_barba'); decimate(beard, 1500); parts.append((beard, 'hair', 'head'))
    if style == 'gorra':
        G = Blobs('Gorra' + name.capitalize(), h)
        for el in range(22, 91, 8):
            for az in range(-180, 180, 12):
                e, a = radians(el), radians(az)
                d = Vector((cos(e) * sin(a), -cos(e) * cos(a), sin(e)))
                p = raycast(bvh, center, d, .13 * h)
                if p is not None: G.ball(p / h + d * .006, .016)
        cap = to_mesh(G.obj, name + '_gorra'); decimate(cap, 1500); parts.append((cap, 'cap', 'head'))
        f = raycast(bvh, center, Vector((0, -1, .45)))
        if f is not None:
            v = prim('sphere', f + Vector((0, -.045, -.004)) * h, (.07 * h, .06 * h, .008 * h), seg=20)
            parts.append((v, 'cap', 'head'))
    return parts


def face_parts(c, body):
    h = c['h']; dg = bpy.context.evaluated_depsgraph_get(); bvh = BVHTree.FromObject(body, dg); parts = []
    for s in (-1, 1):
        p = raycast(bvh, (s * .029 * h, -1, .925 * h), (0, 1, 0))
        if p is None: continue
        ec = p + Vector((0, .0072, 0)) * h
        parts.append((prim('sphere', ec, (.0132 * h, .0132 * h, .012 * h), seg=16), 'eyewhite', 'head'))
        parts.append((prim('sphere', ec + Vector((0, -.0098, 0)) * h, (.0082 * h, .0045 * h, .0082 * h), seg=14), 'iris', 'head'))
        parts.append((prim('sphere', ec + Vector((0, -.0128, 0)) * h, (.0038 * h, .002 * h, .0038 * h), seg=10), 'pupil', 'head'))
        parts.append((prim('sphere', ec + Vector((0, -.0012, .0062)) * h, (.0146 * h, .0138 * h, .0075 * h), seg=16), 'skin', 'head'))  # párpado
        b = raycast(bvh, (s * .03 * h, -1, .952 * h), (0, 1, 0))
        if b is not None:
            parts.append((prim('cube', b + Vector((0, -.002, 0)) * h, (.014 * h, .003 * h, .0032 * h), rot=(0, s * radians(-8), 0)), 'brow', 'head'))
        if c.get('glasses'):
            parts.append((prim('torus', ec + Vector((0, -.022, 0)) * h, (.021 * h, .021 * h, .021 * h), rot=(radians(90), 0, 0)), 'glasses', 'head'))
            parts.append((prim('cube', ec + Vector((s * .022, .03, .002)) * h, (.0015 * h, .035 * h, .0015 * h)), 'glasses', 'head'))
    if c.get('glasses'):
        parts.append((prim('cube', Vector((0, -.083, .927)) * h, (.008 * h, .0015 * h, .0015 * h)), 'glasses', 'head'))
    if c.get('sun'):   # ulleres de sol: vidres foscos
        for s in (-1, 1):
            p = raycast(bvh, (s * .029 * h, -1, .925 * h), (0, 1, 0))
            if p is not None: parts.append((prim('sphere', p + Vector((0, -.012, 0)) * h, (.019 * h, .004 * h, .016 * h), seg=14), 'pupil', 'head'))
    m = raycast(bvh, (0, -1, .874 * h), (0, 1, 0))
    if m is not None:
        parts.append((prim('sphere', m + Vector((0, .002, 0)) * h, (.019 * h, .004 * h, .0045 * h), seg=14), 'lips', 'head'))
    return parts


def clothing(c, body, J):
    """Prendas rígidas extra: delantal y falda."""
    h = c['h']; dg = bpy.context.evaluated_depsgraph_get(); bvh = BVHTree.FromObject(body, dg); parts = []
    if c.get('skirt'):
        sk = prim('cone', (0, 0, .43 * h), (.17 * h, .15 * h, .22 * h), seg=24)
        parts.append((sk, 'skirt', 'hips'))
    if c.get('backpack'):   # motxilla a l'esquena
        p = raycast(bvh, (0, 1, .66 * h), (0, -1, 0)); y = (p.y if p else .08 * h) + .045 * h
        parts.append((prim('sphere', (0, y, .65 * h), (.085 * h, .05 * h, .115 * h), seg=16), 'acc', 'chest'))
        for s in (-1, 1): parts.append((prim('cube', (s * .06 * h, y - .07 * h, .72 * h), (.008 * h, .07 * h, .005 * h)), 'acc', 'chest'))
    tip = Vector(J['tipR']) * h
    if c.get('bag'):        # bossa a la mà dreta
        parts.append((prim('cube', tip + Vector((0, 0, -.06)) * h, (.018 * h, .07 * h, .055 * h)), 'acc', 'hand.R'))
        parts.append((prim('torus', tip + Vector((0, 0, .0)) * h, (.035 * h, .035 * h, .035 * h), rot=(0, radians(90), 0)), 'acc', 'hand.R'))
    if c.get('trolley'):    # carro de la compra
        base = Vector((tip.x - .02 * h, .12 * h, 0))
        parts.append((prim('cube', base + Vector((0, 0, .2)) * h, (.07 * h, .09 * h, .13 * h)), 'acc', 'hand.R'))
        parts.append((prim('cube', (tip + base + Vector((0, 0, .34 * h))) / 2, (.006 * h, .006 * h, (tip.z - .34 * h) / 2 + .02 * h)), 'sole', 'hand.R'))
        for s in (-1, 1): parts.append((prim('sphere', base + Vector((s * .07, .02, .04)) * h, (.012 * h, .04 * h, .04 * h), seg=12), 'sole', 'hand.R'))
    return parts + extras(c, body, J)


def extras(c, body, J):
    """Barrets i complements de les fitxes de referència dels vianants de Barcelona."""
    h = c['h']; dg = bpy.context.evaluated_depsgraph_get(); bvh = BVHTree.FromObject(body, dg); out = []
    V = lambda x, y, z: Vector((x, y, z)) * h
    def sph(p, r, mat, bone, seg=16): out.append((prim('sphere', V(*p), tuple(v * h for v in r), seg=seg), mat, bone))
    def box(p, r, mat, bone, rot=(0, 0, 0)): out.append((prim('cube', V(*p), tuple(v * h for v in r), rot=rot), mat, bone))
    def tor(p, rx, ry, minor, mat, bone, axis=(0, 0, 1)): out.append((ring(V(*p), axis, rx * h, ry * h, minor * h), mat, bone))
    hat = c.get('hat')
    if hat in ('flatcap', 'flatcap_goggles'):
        sph((0, .0, .978), (.092, .104, .04), 'hat', 'head'); box((0, -.098, .962), (.058, .032, .005), 'hat', 'head', rot=(radians(-12), 0, 0))
        if hat == 'flatcap_goggles':
            for s in (-1, 1): tor((s * .028, -.07, .99), .018, .018, .005, 'metal', 'head', axis=(0, 1, .4))
    elif hat == 'beanie':
        sph((0, .008, .962), (.088, .098, .07), 'hat', 'head'); tor((0, .006, .948), .085, .095, .013, 'hat', 'head')
    elif hat == 'cap':
        sph((0, .008, .962), (.086, .096, .062), 'hat', 'head'); sph((0, -.105, .95), (.06, .055, .007), 'hat2', 'head')
    elif hat in ('kerchief', 'mocador_cast'):
        sph((0, .014, .958), (.088, .1, .066), 'hat', 'head'); box((0, .1, .9), (.03, .006, .045), 'hat', 'head', rot=(radians(18), 0, 0))
        sph((0, .1, .935), (.018, .014, .015), 'hat', 'head')
    elif hat == 'bandana':
        tor((0, .006, .962), .094, .106, .011, 'hat', 'head', axis=(0, -.15, 1)); sph((.02, -.03, 1.02), (.018, .014, .012), 'hat', 'head'); sph((-.02, -.03, 1.02), (.018, .014, .012), 'hat', 'head')
    if c.get('bun'): sph((0, .085, 1.02), (.048, .045, .045), 'hair', 'head')
    if c.get('sun_head'):
        for s in (-1, 1): sph((s * .026, -.05, 1.0), (.02, .006, .015), 'pupil', 'head')
    if c.get('earrings'):
        for s in (-1, 1): tor((s * .07, .004, .882), .007, .007, .0018, 'gold', 'head', axis=(1, 0, 0))
    if c.get('paint'):
        p = raycast(bvh, V(.045, -1, .897), (0, 1, 0))
        if p is not None:
            for k, col in enumerate(('paint1', 'paint2')): out.append((prim('cube', p + V(0, -.002, .006 - k * .009), (.016 * h, .002 * h, .003 * h)), col, 'head'))
    if c.get('scarf'):          # bufanda al coll amb dues caigudes a ratlles
        tor((0, .004, .79), .07, .066, .018, 'scarf0', 'chest')
        for s in (-1, 1):
            for k in range(9): box((s * .04, -.078, .77 - k * .024), (.016, .007, .012), 'scarf' + str(k % 2), 'chest')
            if c.get('fringe'): box((s * .045, -.075, .55), (.02, .008, .012), 'fringe', 'chest')
    if c.get('satchel'):        # bandolera: corretja en diagonal i bossa al maluc
        a, b = V(.11, -.07, .78), V(-.13, -.07, .53); m = (a + b) / 2; d = b - a
        o = prim('cube', m, (.009 * h, .004 * h, d.length / 2)); o.rotation_euler = Vector((0, 0, 1)).rotation_difference(d.normalized()).to_euler(); bpy.ops.object.transform_apply(rotation=True)
        out.append((o, 'leather', 'chest')); box((-.15, -.02, .5), (.022, .07, .055), 'leather', 'hips'); box((-.15, -.04, .52), (.024, .055, .02), 'leather2', 'hips')
    if c.get('guitar'):         # estoig de guitarra a l'esquena
        p = raycast(bvh, V(0, 1, .66), (0, -1, 0)); y = (p.y / h if p else .08) + .05
        o = prim('sphere', V(.03, y, .62), (.085 * h, .04 * h, .2 * h), seg=20); o.rotation_euler = (0, radians(-15), 0); bpy.ops.object.transform_apply(rotation=True); out.append((o, 'case', 'chest'))
        o = prim('cube', V(.09, y, .86), (.025 * h, .025 * h, .09 * h)); o.rotation_euler = (0, radians(-15), 0); bpy.ops.object.transform_apply(rotation=True); out.append((o, 'case', 'chest'))
    if c.get('skate'):          # monopatí penjat a l'esquena
        p = raycast(bvh, V(0, 1, .66), (0, -1, 0)); y = (p.y / h if p else .08) + .03
        o = prim('cube', V(.02, y, .66), (.06 * h, .008 * h, .24 * h)); o.rotation_euler = (0, radians(-20), 0); bpy.ops.object.transform_apply(rotation=True); out.append((o, 'case', 'chest'))
    if c.get('basket'):         # cistell de vímet amb flors al maluc
        out.append((prim('cone', V(.16, -.02, .52), (.065 * h, .055 * h, .08 * h), seg=16), 'wicker', 'hips'))
        for k in range(9): sph((.16 + math.cos(k * 2.4) * .04, -.02 + math.sin(k * 2.4) * .035, .6 + (k % 3) * .02), (.02, .02, .02), 'flower' + str(k % 4), 'hips', seg=10)
    if c.get('netbag'):         # xarxa amb taronges a la mà
        tip = Vector(J['tipR']); out.append((prim('sphere', V(tip.x, tip.y, tip.z - .07), (.05 * h, .045 * h, .06 * h), seg=12), 'net', 'hand.R'))
        for k in range(5): sph((tip.x + math.cos(k * 1.3) * .025, tip.y + math.sin(k * 1.3) * .022, tip.z - .08 + (k % 2) * .02), (.021, .021, .021), 'orange', 'hand.R', seg=10)
    if c.get('tied'):           # jaqueta lligada a la cintura
        tor((0, .006, .5), .12, .1, .022, 'tied', 'hips')
        for s in (-1, 1): box((s * .03, -.105, .44), (.03, .012, .06), 'tied', 'hips', rot=(0, s * radians(20), 0))
        box((0, .11, .42), (.13, .012, .1), 'tied', 'hips')
    if c.get('toolbelt'):       # cinturó d'eines amb pinzells
        for s in (-1, 1): box((s * .12, -.04, .49), (.03, .025, .04), 'leather', 'hips')
        for k in range(3): out.append((prim('sphere', V(.11 + k * .012, -.045, .54), (.004 * h, .004 * h, .035 * h), seg=8), 'gold', 'hips'))
    if c.get('towel'): box((.13, -.06, .45), (.035, .006, .07), 'towel', 'hips')
    if c.get('walkie'): box((.13, -.05, .5), (.012, .01, .025), 'pupil', 'hips')
    if c.get('sash_fringe'): box((-.1, -.06, .45), (.03, .008, .07), 'sash', 'hips')
    return out

# ---------------------------------------------------------------- materiales por zona


def palette(c):
    P = {'skin': material('piel', c['skin'], .55), 'top': material('prenda', c['top'], .85),
         'pants': material('pantalon', c['pants'], .8), 'shoes': material('zapatos', c['shoes'], .45),
         'sole': material('suela', c['sole'], .7), 'hair': material('pelo', c['hair'], .6),
         'eyewhite': material('ojo', '#f4f1ea', .25), 'iris': material('iris', c['eyes'], .2),
         'pupil': material('pupila', '#0d0b0a', .1), 'brow': material('ceja', c['hair'] if c['hair_style'] != 'canoso' else '#9b958d', .7),
         'lips': material('labios', '#a8584f' if c['female'] else '#9a5d52', .45)}
    if c.get('under'): P['under'] = material('camisa', c['under'], .8)
    if c.get('belt'): P['belt'] = material('cinturon', c['belt'], .5)
    if c.get('apron'): P['apron'] = material('delantal', c['apron'], .85)
    if c.get('skirt'): P['skirt'] = material('falda', c['skirt'], .85)
    if c.get('legs'): P['legs'] = material('medias', c['legs'], .6)
    if c.get('glasses'): P['glasses'] = material('gafas', c['glasses'], .3, 1.0)
    if c.get('cap'): P['cap'] = material('gorra', c['cap'], .75)
    acc = c.get('backpack') or c.get('bag') or c.get('trolley')
    if acc: P['acc'] = material('accesorio', acc, .6)
    X = {'hat': c.get('hat_col'), 'hat2': c.get('hat_col2') or c.get('hat_col'), 'metal': '#8a8f96', 'gold': '#d4a640', 'paint1': '#a3203a', 'paint2': '#1f2c6e',
         'leather': '#6b4228', 'leather2': '#7d5233', 'case': c.get('case_col', '#2a2220'), 'wicker': '#c9a15e', 'net': '#e8dcc0', 'orange': '#ef8a1f',
         'tied': c.get('tied'), 'towel': '#e9d6c9', 'sash': c.get('sash'), 'fringe': c.get('fringe'), 'socks': '#f2f0ea', 'yoke': c.get('yoke')}
    for k, v in X.items():
        if v: P[k] = material(k, v, .3 if k in ('metal', 'gold') else .75, 1.0 if k in ('metal', 'gold') else 0)
    for k, v in enumerate(c.get('scarf') or []): P['scarf' + str(k)] = material('bufanda' + str(k), v, .9)
    for k, v in enumerate(['#e04a5c', '#f3c63f', '#c45ab3', '#7a5ac8']): P['flower' + str(k)] = material('flor' + str(k), v, .7)
    for k, v in enumerate((c.get('pat') or {}).get('cols', [])): P['pat' + str(k)] = material('estampat' + str(k), v, .85)
    for k, v in enumerate((c.get('vest') or {}).get('cols', [])): P['vest' + str(k)] = material('armilla' + str(k), v, .7)
    return P


def zone(c, J, p):
    x, y, z = p
    if z < .013: return 'sole'
    if z < .062: return 'shoes'
    k = 'L' if x > 0 else 'R'; sh = Vector(J['shoulder' + k]); d = Vector(J['armdir' + k])
    if abs(x) > .13 and seg_dist(Vector(p), sh, Vector(J['tip' + k])) < .065:
        t = (Vector(p) - sh).dot(d) / .34
        if t > 1.0 or t > c['sleeve']: return 'skin'
        return 'top'
    if c.get('hood') and y > .03 and z < .865 and z > .74: return 'top'
    if (z > .80 and abs(x) < .06) or z > .845: return 'skin'
    if c.get('apron') and y < 0 and abs(x) < (.13 if c.get('apron_long') else .1) and (.3 if c.get('apron_long') else .45) < z < .72 and not (abs(x) > .13): return 'apron'
    if c.get('skirt'):
        return 'legs' if z < .34 else 'top'
    if c.get('shorts') and z < .33: return 'skin'
    if c.get('belt') and .528 < z < .548: return 'belt'
    if z < .528: return 'pants'
    if c.get('jacket') and abs(x) < .026 and y < 0 and .56 < z < .80: return 'under'
    return 'top'


def zone_x(c, J, p):
    """Zona amb estampats: ratlles, mosaic, flors, armilla, coll obert, canesú, faixa i mitjons."""
    z0 = zone(c, J, p); x, y, z = p
    k = 'L' if x > 0 else 'R'; arm = abs(x) > .13 and seg_dist(Vector(p), Vector(J['shoulder' + k]), Vector(J['tip' + k])) < .065
    hsh = lambda: int(abs(math.floor(x / .022) * 73856093 ^ math.floor(y / .022) * 19349663 ^ math.floor(z / .022) * 83492791))
    if c.get('sash') and not arm and .49 < z < .575 and z0 in ('top', 'pants', 'belt'): return 'sash'
    if c.get('shorts') and c.get('socks') and .062 <= z < .17: return 'socks'
    if z0 == 'top':
        if c.get('open') and not arm and y < 0 and z > .56 and abs(x) < .012 + .045 * (z - .56) / .24: return 'skin'
        if c.get('yoke') and z > .735: return 'yoke'
        v = c.get('vest')
        if v and not arm and .5 < z < .79 and not (y < 0 and abs(x) < .036):
            n = len(v['cols']); return 'vest' + str(hsh() % n if v.get('kind') == 'mosaic' else 0)
        pt = c.get('pat')
        if pt:
            w = pt.get('w', .035); kd = pt['kind']; n = len(pt['cols'])
            if kd == 'vstripes': return 'pat' + str(int(math.floor((x + 1) / w)) % 2)
            if kd == 'hstripes': return 'pat' + str(int(math.floor(z / w)) % 2)
            if kd == 'mosaic': return 'pat' + str(hsh() % n)
            if kd == 'floral': q = hsh() % 10; return 'pat' + str(0 if q < 7 else 1 + q % (n - 1))
    return z0


def cut_planes(c, J, body):
    """Corta la malla por los límites de cada prenda para que los bordes queden limpios."""
    h = c['h']; planes = [((0, 0, z), (0, 0, 1)) for z in (.013, .062, .528, .548, .52, .80, .845, .74, .865)]
    if c.get('jacket'): planes += [((x, 0, 0), (1, 0, 0)) for x in (-.026, .026)]
    if c.get('hood'): planes.append(((0, .03, 0), (0, 1, 0)))
    if c.get('apron'): planes += [((x, 0, 0), (1, 0, 0)) for x in (-.1, .1)] + [((0, 0, z), (0, 0, 1)) for z in (.45, .72)] + [((0, 0, 0), (0, 1, 0))]
    if c.get('skirt'): planes.append(((0, 0, .34), (0, 0, 1)))
    if c.get('shorts'): planes.append(((0, 0, .33), (0, 0, 1)))
    planes += [((x, 0, 0), (1, 0, 0)) for x in (-.06, .06)]
    pt = c.get('pat') or {}
    if pt.get('kind') == 'vstripes': planes += [((-1 + k * pt.get('w', .035), 0, 0), (1, 0, 0)) for k in range(int(1 / pt.get('w', .035)) * 2 + 1) if abs(-1 + k * pt.get('w', .035)) < .25]
    if pt.get('kind') == 'hstripes': planes += [((0, 0, k * pt.get('w', .035)), (0, 0, 1)) for k in range(int(.5 / pt.get('w', .035)), int(.8 / pt.get('w', .035)) + 1)]
    if c.get('vest'): planes += [((0, 0, .5), (0, 0, 1)), ((0, 0, .79), (0, 0, 1)), ((-.036, 0, 0), (1, 0, 0)), ((.036, 0, 0), (1, 0, 0))]
    if c.get('sash'): planes += [((0, 0, .49), (0, 0, 1)), ((0, 0, .575), (0, 0, 1))]
    if c.get('yoke'): planes.append(((0, 0, .735), (0, 0, 1)))
    if c.get('socks'): planes.append(((0, 0, .17), (0, 0, 1)))
    if c.get('apron_long'): planes += [((0, 0, .3), (0, 0, 1))]
    for k in 'LR':
        sh, d = Vector(J['shoulder' + k]), Vector(J['armdir' + k])
        for t in {min(c['sleeve'], 1.0), 1.0}: planes.append((tuple(sh + d * .34 * t), tuple(d)))
    bm = bmesh.new(); bm.from_mesh(body.data)
    for co, no in planes:
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:] + bm.edges[:] + bm.faces[:], plane_co=Vector(co) * h, plane_no=Vector(no))
    bm.to_mesh(body.data); bm.free()
    for p in body.data.polygons: p.use_smooth = True


def ring(center, axis, rx, ry, minor):
    bpy.ops.mesh.primitive_torus_add(major_segments=28, minor_segments=8, major_radius=1, minor_radius=minor / ((rx + ry) / 2),
                                     location=center)
    o = bpy.context.active_object; o.scale = (rx, ry, (rx + ry) / 2)
    o.rotation_euler = Vector((0, 0, 1)).rotation_difference(Vector(axis).normalized()).to_euler()
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    for p in o.data.polygons: p.use_smooth = True
    return o


def garment_rings(c, J, body):
    """Dobladillos, puños, cinturón y cuello con volumen propio."""
    h = c['h']; dg = bpy.context.evaluated_depsgraph_get(); bvh = BVHTree.FromObject(body, dg); out = []

    def radius(center, axis, probe):
        hit = raycast(bvh, center, probe)       # desde dentro: el primer impacto es la propia superficie
        return (hit - center).length if hit else None

    def around_z(z, add, minor, mat, cx=0.0):
        ctr = Vector((cx, 0, z)) * h
        rx = (radius(ctr, 0, Vector((1, 0, 0))) + radius(ctr, 0, Vector((-1, 0, 0)))) / 2
        ryf = radius(ctr, (0, 0, 1), Vector((0, -.5, 0))); ryb = radius(ctr, (0, 0, 1), Vector((0, .5, 0)))
        if not (rx and ryf and ryb): return
        ctr.y += (ryb - ryf) / 2
        out.append((ring(ctr, (0, 0, 1), rx + add * h, (ryf + ryb) / 2 + add * h, minor * h), mat))

    if c.get('belt'): around_z(.538, .003, .011, 'belt')
    if c.get('jacket'): around_z(.556, .006, .009, 'top')
    if not c.get('skirt'):
        for s in (-1, 1):
            ctr = Vector((s * .09, .003, .072)) * h
            r = radius(ctr, (0, 0, 1), Vector((0, -.3, 0)))
            if r: out.append((ring(ctr, (0, 0, 1), r + .004 * h, r + .004 * h, .008 * h), 'pants'))
    around_z(.80, .005, .008, 'under' if c.get('under') else 'top')
    for k in 'LR':
        sh, d = Vector(J['shoulder' + k]), Vector(J['armdir' + k]); t = min(c['sleeve'], .97)
        ctr = (sh + d * .34 * t) * h; r = radius(ctr, d, Vector((0, -.3, 0)))
        if r: out.append((ring(ctr, d, r + .003 * h, r + .003 * h, (.010 if c['sleeve'] < 1 else .007) * h), 'top'))
    return out


def assign_zones(c, J, body, P):
    names = list(P.keys())
    for n in names: body.data.materials.append(P[n])
    h = c['h']; v = body.data.vertices
    for poly in body.data.polygons:
        ctr = sum((v[i].co for i in poly.vertices), Vector()) / len(poly.vertices) / h
        poly.material_index = names.index(zone_x(c, J, tuple(ctr)))
    return names

# ---------------------------------------------------------------- pesos


def seg_dist(p, a, b):
    ab = b - a; t = max(0, min(1, (p - a).dot(ab) / ab.length_squared)); return (p - (a + ab * t)).length


def skin_weights(body, J, h):
    segs = [(n, Vector(J[a]) * h, Vector(J[b]) * h) for n, a, b, _ in BONES]
    for n, _, _ in segs: body.vertex_groups.new(name=n)
    for vtx in body.data.vertices:
        ds = sorted(((seg_dist(vtx.co, a, b), n) for n, a, b in segs))[:3]
        ws = [(1 / max(d, .004 * h) ** 6, n) for d, n in ds]; tot = sum(w for w, _ in ws)
        for w, n in ws:
            if w / tot > .02: body.vertex_groups[n].add([vtx.index], w / tot, 'REPLACE')


def rigid(obj, bone):
    g = obj.vertex_groups.new(name=bone); g.add([v.index for v in obj.data.vertices], 1.0, 'REPLACE')

# ---------------------------------------------------------------- animaciones


def wq(axis, deg):
    return Quaternion(Vector(axis), radians(deg))


def make_actions(rig, h):
    rest = {b.name: b.matrix_local.to_quaternion() for b in rig.data.bones}
    rig.animation_data_create()

    def down(k, extra=0):
        return [((0, 1, 0), (18 + extra) * (1 if k == 'L' else -1))]

    def key(act_name, frames, fn, step=2):
        act = bpy.data.actions.new(act_name); act.use_fake_user = True
        rig.animation_data.action = act
        for fr in list(range(0, frames, step)) + [frames]:
            t = (fr % frames) / frames; pose = fn(2 * pi * t)
            for pb in rig.pose.bones:
                q = Quaternion()
                for axis, deg in pose.get(pb.name, []): q = wq(axis, deg) @ q
                r = rest[pb.name]; pb.rotation_quaternion = r.inverted() @ q @ r
                pb.keyframe_insert('rotation_quaternion', frame=fr)
            hb = rig.pose.bones['hips']; hb.location = Vector((0, pose.get('_bob', 0) * h, 0))
            hb.keyframe_insert('location', frame=fr)
        return act

    def idle(f):
        return {'upper_arm.L': down('L') + [((1, 0, 0), 2 * sin(f))], 'upper_arm.R': down('R') + [((1, 0, 0), -2 * sin(f))],
                'forearm.L': [((1, 0, 0), -10)], 'forearm.R': [((1, 0, 0), -10)],
                'chest': [((1, 0, 0), 1.6 * sin(f))], 'head': [((0, 0, 1), 4 * sin(f + 1)), ((1, 0, 0), -1.5 * sin(f))],
                '_bob': .002 * sin(f)}

    def walk(f, amp=1.0):
        s, cs = sin(f), cos(f)
        return {'thigh.L': [((1, 0, 0), -24 * s * amp)], 'thigh.R': [((1, 0, 0), 24 * s * amp)],
                'shin.L': [((1, 0, 0), 5 + 34 * max(0, cs) ** 1.5 * amp)], 'shin.R': [((1, 0, 0), 5 + 34 * max(0, -cs) ** 1.5 * amp)],
                'foot.L': [((1, 0, 0), -8 * max(0, -s))], 'foot.R': [((1, 0, 0), -8 * max(0, s))],
                'upper_arm.L': down('L', 2) + [((1, 0, 0), 20 * s * amp)], 'upper_arm.R': down('R', 2) + [((1, 0, 0), -20 * s * amp)],
                'forearm.L': [((1, 0, 0), -18 - 8 * max(0, -s))], 'forearm.R': [((1, 0, 0), -18 - 8 * max(0, s))],
                'hips': [((0, 0, 1), 6 * s)], 'spine': [((1, 0, 0), 2)], 'chest': [((0, 0, 1), -9 * s)],
                'head': [((0, 0, 1), 3 * s)], '_bob': .011 * cos(2 * f)}

    def run(f):
        s, cs = sin(f), cos(f)
        return {'thigh.L': [((1, 0, 0), -10 - 42 * s)], 'thigh.R': [((1, 0, 0), -10 + 42 * s)],
                'shin.L': [((1, 0, 0), 12 + 75 * max(0, cs) ** 1.2)], 'shin.R': [((1, 0, 0), 12 + 75 * max(0, -cs) ** 1.2)],
                'foot.L': [((1, 0, 0), -15 * max(0, -s))], 'foot.R': [((1, 0, 0), -15 * max(0, s))],
                'upper_arm.L': down('L', -4) + [((1, 0, 0), 42 * s)], 'upper_arm.R': down('R', -4) + [((1, 0, 0), -42 * s)],
                'forearm.L': [((1, 0, 0), -80)], 'forearm.R': [((1, 0, 0), -80)],
                'hips': [((0, 0, 1), 8 * s)], 'spine': [((1, 0, 0), 11)], 'chest': [((1, 0, 0), 4), ((0, 0, 1), -12 * s)],
                'head': [((1, 0, 0), -8)], '_bob': .02 * cos(2 * f) - .012}

    def talk(f):
        p = idle(f)
        p['upper_arm.R'] = down('R', -10) + [((1, 0, 0), -22 + 6 * sin(2 * f))]
        p['forearm.R'] = [((1, 0, 0), -62 + 14 * sin(2 * f)), ((0, 0, 1), 10 * sin(f))]
        p['hand.R'] = [((0, 1, 0), 18 * sin(2 * f + .5))]
        p['head'] = [((1, 0, 0), 4 * sin(3 * f)), ((0, 0, 1), 6 * sin(f))]
        p['chest'] = [((0, 1, 0), 2.5 * sin(f)), ((0, 0, 1), 4 * sin(f))]
        return p

    def wave(f):
        p = idle(f)
        p['upper_arm.R'] = [((0, 1, 0), 140)]
        p['forearm.R'] = [((0, 1, 0), 22 * sin(2 * f)), ((1, 0, 0), -12)]
        p['head'] = [((0, 1, 0), -5), ((0, 0, 1), -6)]
        return p

    def point(f):
        p = idle(f)
        p['upper_arm.R'] = down('R') + [((1, 0, 0), -82 + 2 * sin(f))]
        p['forearm.R'] = [((1, 0, 0), -6)]
        p['chest'] = [((0, 0, 1), -10)]
        p['head'] = [((0, 0, 1), -12)]
        return p

    acts = [key('reposo', 60, idle), key('andar', 32, walk), key('correr', 20, run), key('hablar', 60, talk),
            key('saludar', 40, wave), key('senalar', 60, point)]
    rig.animation_data.action = acts[0]
    bpy.context.scene.render.fps = 30
    return acts

# ---------------------------------------------------------------- render de vistas


def setup_render(res):
    sc = bpy.context.scene; sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 24
    sc.cycles.use_denoising = True; sc.render.resolution_x, sc.render.resolution_y = res; sc.render.film_transparent = False
    sc.view_settings.view_transform = 'Standard'
    w = bpy.data.worlds.new('mundo'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs['Color'].default_value = lin('#f4ead6')
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.7; sc.world = w


def lights(h, spread=0.0):
    for name, loc, energy, size, col in (('clave', (-2.2 - spread, -3.0, 3.2), 900, 2.5, '#fff1de'),
                                         ('relleno', (2.8 + spread, -2.5, 1.6), 350, 3.0, '#e6eeff'),
                                         ('contra', (0.5, 3.0, 2.8), 600, 1.5, '#ffe4c4')):
        L = bpy.data.lights.new(name, 'AREA'); L.energy = energy * .55 * h / 1.7; L.size = size; L.color = lin(col)[:3]
        o = bpy.data.objects.new(name, L); bpy.context.scene.collection.objects.link(o); o.location = loc
        o.rotation_euler = (Vector((0, 0, h * .6)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()


def camera(loc, target, ortho=None, lens=85):
    cd = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cd); bpy.context.scene.collection.objects.link(cam)
    cam.location = loc; cam.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
    if ortho: cd.type = 'ORTHO'; cd.ortho_scale = ortho
    else: cd.lens = lens
    bpy.context.scene.camera = cam; return cam


def text(body, loc, size, col):
    cu = bpy.data.curves.new('txt', 'FONT'); cu.body = body; cu.size = size; cu.align_x = 'CENTER'
    o = bpy.data.objects.new('txt', cu); bpy.context.scene.collection.objects.link(o); o.location = loc; o.rotation_euler = (radians(90), 0, 0)
    o.data.materials.append(material('txt', col, .9)); return o


def render_views(key, c, objs):
    h = c['h']; sc = bpy.context.scene; OUT_VIEWS.mkdir(parents=True, exist_ok=True)
    setup_render((640, 640)); sc.frame_set(0)
    cam = camera((0.35 * h, -1.25 * h, .93 * h), (0, 0, .9 * h), lens=85); lights(h)
    sc.render.image_settings.file_format = 'WEBP'; sc.render.image_settings.quality = 88
    sc.render.filepath = str(OUT_GLB / f'retrato-{key}.webp'); bpy.ops.render.render(write_still=True)
    for o in list(sc.objects):
        if o.type in ('CAMERA', 'LIGHT'): bpy.data.objects.remove(o)
    # Hoja de vistas: el personaje se instancia cuatro veces.
    col = bpy.data.collections.new('pj_' + key)
    for o in objs:
        for uc in list(o.users_collection): uc.objects.unlink(o)
        col.objects.link(o)
    gap = 0.95; labels = (('FRENTE', 0), ('3/4', -40), ('PERFIL', -90), ('ESPALDA', 180))
    for i, (lab, ang) in enumerate(labels):
        e = bpy.data.objects.new('vista' + lab, None); e.instance_type = 'COLLECTION'; e.instance_collection = col
        e.location = ((i - 1.5) * gap, 0, 0); e.rotation_euler = (0, 0, radians(ang)); sc.collection.objects.link(e)
        text(lab, ((i - 1.5) * gap, -.6, -.16), .085, '#3b3a35')
    text(c['nombre'] + '  ·  Aparadors BCN', (0, -.6, 1.88), .11, '#183e3a')
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0)); fl = bpy.context.active_object
    fl.data.materials.append(material('suelo', '#e6d9bf', .9))
    setup_render((1800, 900)); camera((0, -10, .86), (0, 0, .86), ortho=4.3); lights(1.7, spread=1.5)
    sc.render.image_settings.file_format = 'PNG'; sc.render.filepath = str(OUT_VIEWS / f'{key}-vistas.png')
    bpy.ops.render.render(write_still=True)

# ---------------------------------------------------------------- principal


def make(key, do_render=True):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    c = CAST[key]; h = c['h']; J = joints(c)
    body = build_body(c, J, key); cut_planes(c, J, body)
    P = palette(c); names = assign_zones(c, J, body, P)
    rings = garment_rings(c, J, body)
    bpy.ops.object.select_all(action='DESELECT')
    for obj, mat in rings:
        obj.data.materials.clear(); obj.data.materials.append(P[mat]); obj.select_set(True)
    body.select_set(True); bpy.context.view_layer.objects.active = body; bpy.ops.object.join()
    skin_weights(body, J, h)
    extra = face_parts(c, body) + hair_blobs(c, body, key) + clothing(c, body, J)
    for obj, mat, bone in extra:
        obj.data.materials.clear(); obj.data.materials.append(P[mat]); rigid(obj, bone)
    bpy.ops.object.select_all(action='DESELECT')
    for obj, _, _ in extra: obj.select_set(True)
    body.select_set(True); bpy.context.view_layer.objects.active = body; bpy.ops.object.join()
    body.name = key
    rig = build_armature(J, h, key)
    body.parent = rig; mod = body.modifiers.new('rig', 'ARMATURE'); mod.object = rig
    make_actions(rig, h)
    OUT_GLB.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT'); body.select_set(True); rig.select_set(True); bpy.context.view_layer.objects.active = rig
    bpy.ops.export_scene.gltf(filepath=str(OUT_GLB / f'{key}.glb'), export_format='GLB', use_selection=True,
                              export_animations=True, export_animation_mode='ACTIONS', export_skins=True,
                              export_def_bones=False, export_yup=True, export_apply=False, export_morph=False,
                              export_force_sampling=True, export_optimize_animation_size=True)
    tris = sum(len(p.vertices) - 2 for p in body.data.polygons)
    print(f'[pj] {key}: {tris} triángulos, {len(rig.data.bones)} huesos -> {key}.glb')
    if do_render and not c.get('passer'): render_views(key, c, [body, rig])


if __name__ == '__main__':
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    only = list(CAST)
    if '--solo' in argv: only = argv[argv.index('--solo') + 1].split(',')
    for k in only: make(k, '--sin-render' not in argv)
