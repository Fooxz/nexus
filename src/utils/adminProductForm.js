import { getSpecFields } from '../data/adminProductFormConfig'

export const PRODUCT_FORM_EMPTY = {
  nombre: '',
  marca: '',
  categoria: '',
  precio: '',
  precioNormal: '',
  descuento: '',
  imagen: '',
  descripcion: '',
  stock: '',
  activo: true,
  specs: {},
}

export function formatCOP(value) {
  return value ? `$${Number(value).toLocaleString('es-CO')}` : '-'
}

export function createFormFromProduct(producto) {
  return {
    nombre: producto.nombre ?? '',
    marca: producto.marca ?? '',
    categoria: producto.categoria ?? '',
    precio: producto.precio ?? '',
    precioNormal: producto.precioNormal ?? '',
    descuento: producto.descuento ?? '',
    imagen: producto.imagen ?? '',
    descripcion: producto.descripcion ?? '',
    stock: producto.stock ?? 0,
    activo: producto.activo ?? true,
    specs: extractSpecs(producto),
  }
}

export function validateProductForm(form) {
  const errors = {}
  if (!form.nombre.trim()) errors.nombre = true
  if (!form.categoria) errors.categoria = true
  if (!form.precio || isNaN(Number(form.precio))) errors.precio = true
  return errors
}

export function buildProductPayload(form) {
  const specs = cleanSpecs(form.categoria, form.specs)
  return {
    ...form,
    ...specs,
    specs,
    precio: Number(form.precio),
    precioNormal: form.precioNormal ? Number(form.precioNormal) : undefined,
    descuento: form.descuento ? Number(form.descuento) : 0,
    stock: form.stock ? Number(form.stock) : 0,
    activo: form.activo,
  }
}

function extractSpecs(producto) {
  const specs = { ...(producto.specs ?? {}) }
  getSpecFields(producto.categoria).forEach(({ name }) => {
    if (producto[name] !== undefined && producto[name] !== null && producto[name] !== '') {
      specs[name] = producto[name]
    }
  })
  return specs
}

function normalizeSpecValue(value, type) {
  if (type === 'boolean') {
    if (value === true || value === 'true') return true
    if (value === false || value === 'false') return false
    return undefined
  }
  if (type === 'number') return value === '' || value === undefined ? undefined : Number(value)
  return typeof value === 'string' ? value.trim() : value
}

function cleanSpecs(categoria, specs) {
  return getSpecFields(categoria).reduce((acc, field) => {
    const value = normalizeSpecValue(specs?.[field.name], field.type)
    if (value !== undefined && value !== null && value !== '' && !Number.isNaN(value)) {
      acc[field.name] = value
    }
    return acc
  }, {})
}
