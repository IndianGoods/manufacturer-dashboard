import Breadcrumbs from '../../components/layout/Breadcrumbs'

const Products = () => {
  const breadcrumbItems = [
    { name: 'Products' }
  ]

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your product catalog and inventory.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Product Management</h2>
        <p className="text-gray-600">Products page coming soon...</p>
      </div>
    </div>
  )
}

export default Products