import Image from "next/image";

const NoTask = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen m-auto">
      <div className="flex items-center justify-center h-[200px] w-[250px] p-0">
        <Image
          src="/bg/EmptyState.png"
          width={250}
          height={200}
          alt="File Image"
        />
      </div>

      <div className="flex flex-col items-center justify-center mt-12">
        <span className="font-bold text-[#334155] text-lg">
          No tasks created
        </span>
        <span className="text-[#64748B] text-sm font-normal">
          Tasks will be displayed here once they're created
        </span>
      </div>
    </div>
  );
};

export default NoTask;
