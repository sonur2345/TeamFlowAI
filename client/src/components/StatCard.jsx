function StatCard({ title, value, description, icon: Icon }) {

  return (

    <div className="bg-white p-6 rounded-xl border border-slate-200">

      <div className="flex items-center justify-between">

        <p className="text-slate-500 text-sm">
          {title}
        </p>

        <Icon className="text-blue-600" size={22} />

      </div>

      <h2 className="text-3xl font-bold mt-4">
        {value}
      </h2>

      <p className="text-sm text-green-600 mt-2">
        {description}
      </p>

    </div>
  );
}

export default StatCard;