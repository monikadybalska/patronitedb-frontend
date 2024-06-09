import CheckboxSelect from "./checkbox-select";

export default function Filters({
  filterListOpen,
}: {
  filterListOpen: boolean;
}) {
  return (
    <div className={filterListOpen ? "filters" : "filters hidden"}>
      <div>
        <h3 className="filter-header">Categories</h3>
        <CheckboxSelect />
      </div>
    </div>
  );
}
