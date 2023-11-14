import { FormControl, TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useContextProvider } from "../../../../CommonComponents/Context";
import { Category } from "../../../../Models/Common/CommonMaster";
import { Dispatch, SetStateAction, useState } from "react";
import { TaskDTO } from "../../../../Models/Task/Task";

type SelectCategoryProps = {
  setUIApplicable: Dispatch<SetStateAction<boolean>>;
  setTask: Dispatch<SetStateAction<TaskDTO>>;
};

export const SelectCategory = ({
  setUIApplicable,
  setTask,
}: SelectCategoryProps) => {
  const { category } = useContextProvider();
  const [selectedCategory, setCategory] = useState<string>("");

  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-3">
      <FormControl className="w-50 m-3">
        <Autocomplete
          disablePortal
          options={[...new Set(category.map((x) => x.categories))].map(
            (category: string) => ({
              label: category,
              id: category,
            })
          )}
          onChange={(e: any, value: any) => {
            if (value) {
              setCategory(value.label);
            } else {
              setCategory("");
              return e;
            }
          }}
          style={{ width: "100%" }}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />
      </FormControl>
      <FormControl className="w-50 m-3">
        <Autocomplete
          disablePortal
          options={category
            .filter((x) => x.categories === selectedCategory)
            .map((category: Category) => ({
              label: category.subCategory,
              id: category.subCategory,
            }))}
          onChange={(e: any, value: any) => {
            if (value) {
              var selCategory: Category | undefined = category.find(
                (x) => x.categories.trim() === selectedCategory.trim()
              );
              setTask((prev: TaskDTO) => {
                return { ...prev, categoryId: selCategory?.id ?? 0 };
              });
              if (value.label === "UILevelTask") {
                setUIApplicable(true);
              } else {
                setUIApplicable(false);
              }
              return e;
            } else {
              setTask((prev: TaskDTO) => {
                return { ...prev, categoryId: 0 };
              });
            }
          }}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField {...params} label="Sub Category" />
          )}
        />
      </FormControl>
    </div>
  );
};
