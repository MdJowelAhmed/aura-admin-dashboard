const CityUsersTable = () => {
  const tableData = [
    {
      rank: 1,
      city: "New York",
      state: "New York",
      users: "(8M)",
      signups: 300,
    },
    {
      rank: 2,
      city: "Los Angeles",
      state: "California",
      users: "(8M)",
      signups: 300,
    },
    {
      rank: 3,
      city: "Chicago",
      state: "Illinois",
      users: "(8M)",
      signups: 300,
    },
    {
      rank: 4,
      city: "New York",
      state: "New York",
      users: "(8M)",
      signups: 300,
    },
  ];

  return (
    <div className="bg-transparent my-10">
      <div className="overflow-hidden rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/25 text-white">
              <th className="p-4 text-left font-semibold">Rank</th>
              <th className="p-4 text-left font-semibold">City</th>
              <th className="p-4 text-left font-semibold">State</th>
              <th className="p-4 text-left font-semibold">Users</th>
              <th className="p-4 text-right font-semibold">Sign-ups</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700">
            {tableData.map((row) => (
              <tr key={row.rank} className="bg-white">
                <td className="p-3 text-gray-800 border-b-2 border-gray-700">
                  {row.rank}
                </td>
                <td className="p-3 text-gray-800 border-b-2 border-gray-700">
                  {row.city}
                </td>
                <td className="p-3 text-gray-800 border-b-2 border-gray-700">
                  {row.state}
                </td>
                <td className="p-3 text-gray-800 border-b-2 border-gray-700">
                  {row.users}
                </td>
                <td className="p-3 text-gray-800 text-right border-b-2 border-gray-700">
                  {row.signups}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CityUsersTable;
