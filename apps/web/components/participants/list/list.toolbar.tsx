import ListFilter from "@/components/common/list/list.filter";
import SearchAction from "@/components/common/list/list.search";

const ListToolBar = () => {
  return (
    <div className="w-full flex items-center space-x-2">
      <SearchAction />

      <div className="flex gap-2 ml-auto w-[15%] justify-end">
        <ListFilter />
      </div>
    </div>
  );
};

export default ListToolBar;
