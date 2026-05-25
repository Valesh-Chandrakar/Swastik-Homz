import { useMemo } from 'react'
import { HiLightningBolt, HiTrendingUp, HiCurrencyRupee, HiCalendar } from 'react-icons/hi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

/**
 * Student-facing electricity consumption tracker.
 * Takes the student's payment history and surfaces just the electricity numbers:
 *   - Current month units + bill
 *   - 6-month rolling consumption chart
 *   - YTD total units and amount
 *
 * Props:
 *   payments — array of payment records returned from /api/payments/student/{id}
 */
export default function ElectricityTracker({ payments = [] }) {
  const chartData = useMemo(() => {
    return [...payments]
      .filter((p) => p.electricityUnits != null)
      .sort((a, b) => (a.year - b.year) || (a.month - b.month))
      .slice(-6)
      .map((p) => ({
        label: `${MONTHS[p.month - 1]} '${String(p.year).slice(2)}`,
        units: Number(p.electricityUnits || 0),
        bill: Number(p.electricityAmount || 0),
        rate: Number(p.electricityRate || 0),
      }))
  }, [payments])

  const current = chartData.length > 0 ? chartData[chartData.length - 1] : null
  const previous = chartData.length > 1 ? chartData[chartData.length - 2] : null

  const ytd = useMemo(() => {
    const thisYear = new Date().getFullYear()
    const yearPayments = payments.filter((p) => p.year === thisYear)
    return {
      units: yearPayments.reduce((sum, p) => sum + Number(p.electricityUnits || 0), 0),
      amount: yearPayments.reduce((sum, p) => sum + Number(p.electricityAmount || 0), 0),
      months: yearPayments.length,
    }
  }, [payments])

  const changePercent = current && previous && previous.units > 0
    ? ((current.units - previous.units) / previous.units * 100).toFixed(1)
    : null

  if (payments.length === 0) {
    return (
      <div className="card text-center py-12">
        <HiLightningBolt size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-gray-500 dark:text-gray-400">No electricity records yet</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your monthly consumption will show here once your warden adds the meter reading.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {current ? `${current.units}` : '—'}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1 font-normal">units</span>
              </p>
              {changePercent != null && (
                <p className={`text-xs font-medium mt-0.5 ${Number(changePercent) > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {Number(changePercent) > 0 ? '↑' : '↓'} {Math.abs(changePercent)}% vs last month
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
              <HiLightningBolt size={24} />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Current Bill</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                ₹{current ? current.bill.toLocaleString() : '—'}
              </p>
              {current && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@ ₹{current.rate}/unit</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
              <HiCurrencyRupee size={24} />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">YTD Consumption</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {ytd.units.toFixed(0)}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1 font-normal">units</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ytd.months} month{ytd.months !== 1 ? 's' : ''}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <HiTrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/20 dark:to-sky-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">YTD Bill</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                ₹{ytd.amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Avg ₹{ytd.months ? (ytd.amount / ytd.months).toFixed(0) : 0}/mo
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <HiCalendar size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Consumption chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Consumption History</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last 6 months</p>
          </div>
          <Badge>Units</Badge>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }}
              formatter={(v, name) => name === 'units' ? [`${v} units`, 'Consumption'] : [`₹${v}`, 'Bill']}
            />
            <Line type="monotone" dataKey="units" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 5 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly bill comparison */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Monthly Bills</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Electricity charges only</p>
          </div>
          <Badge variant="pink">₹ INR</Badge>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(v) => `₹${v}`} />
            <Tooltip
              contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb' }}
              formatter={(v) => [`₹${Number(v).toLocaleString()}`, 'Bill']}
            />
            <Bar dataKey="bill" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detail table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/30">
              <tr>
                <th className="table-header">Month</th>
                <th className="table-header">Units Consumed</th>
                <th className="table-header">Rate per Unit</th>
                <th className="table-header">Bill Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {[...chartData].reverse().map((row) => (
                <tr key={row.label} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="table-cell font-medium">{row.label}</td>
                  <td className="table-cell">{row.units} units</td>
                  <td className="table-cell">₹{row.rate}</td>
                  <td className="table-cell font-semibold text-pink-600 dark:text-pink-400">₹{row.bill.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Badge({ children, variant = 'gray' }) {
  const variants = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  }
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>{children}</span>
}
