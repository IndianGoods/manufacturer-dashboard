import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { setOverview, setSalesData, setTopProducts, setRecentActivity } from '../../store/slices/analyticsSlice'
import { mockAnalytics } from '../../data/mockData'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Breadcrumbs from '../../components/layout/Breadcrumbs'
import { formatCurrency, formatDate } from '../../utils/helpers'

const StatCard = ({ title, value, change, changeType, icon: Icon }) => {
  const isPositive = changeType === 'positive'
  
  return (
    <Card>
      <Card.Content className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-8 w-8 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isPositive ? (
                      <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4" />
                    )}
                    <span className="sr-only">{isPositive ? 'Increased' : 'Decreased'} by</span>
                    {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

const Home = () => {
  const dispatch = useDispatch()
  const { overview, salesData, topProducts, recentActivity } = useSelector((state) => state.analytics)

  useEffect(() => {
    // Load mock data
    dispatch(setOverview(mockAnalytics.overview))
    dispatch(setSalesData(mockAnalytics.salesData))
    dispatch(setTopProducts(mockAnalytics.topProducts))
    dispatch(setRecentActivity(mockAnalytics.recentActivity))
  }, [dispatch])

  const breadcrumbItems = [{ name: 'Dashboard' }]

  const stats = [
    {
      title: 'Total Sales',
      value: formatCurrency(overview.totalSales),
      change: '+12.5%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      title: 'Total Orders',
      value: overview.totalOrders?.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: ClipboardDocumentListIcon,
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(overview.averageOrderValue),
      change: '+4.1%',
      changeType: 'positive',
      icon: ShoppingBagIcon,
    },
    {
      title: 'Total Customers',
      value: overview.totalCustomers?.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
  ]

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sales Chart */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
            <p className="text-sm text-gray-500">Last 7 days</p>
          </Card.Header>
          <Card.Content>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => formatDate(value)}
                  />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value)}
                    formatter={(value) => [formatCurrency(value), 'Sales']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#0743ba" 
                    strokeWidth={2}
                    dot={{ fill: '#0743ba' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>

        {/* Top Products */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
            <p className="text-sm text-gray-500">By sales this month</p>
          </Card.Header>
          <Card.Content>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Sales']} />
                  <Bar dataKey="sales" fill="#0743ba" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </Card.Header>
        <Card.Content>
          <div className="flow-root">
            <ul className="-mb-8">
              {recentActivity.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== recentActivity.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                          <div className="h-2 w-2 bg-white rounded-full" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">{activity.message}</p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {formatDate(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default Home