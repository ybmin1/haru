export default function Home() {
  return (
    <div className="w-full px-20 py-12">
      <div className="px-8">
        <div className="flex justify-end rounded-lg border border-gray-300 bg-gray-100 p-2">
          <div className="p-2">
            <div className="w-[272px] bg-gray-100 m-2">sidebar</div>
          </div>

          <div className="w-full rounded-lg border border-gray-300 bg-white">
            <div className="flex items-center h-[47px] border-b border-gray-300 px-6">
              Goal 1
            </div>
            <div className="p-6">
              <div className="mx-auto grid grid-cols-2 gap-5">
                <div className="w-full h-[184px] rounded-xl border border-gray-300 p-6">
                  column
                </div>
                <div className="w-full h-[184px] rounded-xl border border-gray-300 p-6">
                  column
                </div>
              </div>
              <div className="h-[390px] border border-gray-300 rounded-2xl mt-6 p-6">
                calendar
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
