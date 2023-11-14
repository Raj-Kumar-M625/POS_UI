import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Backdrop,
} from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Get } from "../../../Services/Axios";
import { useEffect } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
export const SelectCategory = ({
  openDialog,
  userstoryName,
  userstoryId,
  setOpenDialog,
}: any) => {
  interface Category {
    id: string;
    categories: string;
    subCategory: string;
    uiApplicable:boolean;
  }
  const [errorMsg, setErrorMsg] = useState<any>({
    message: "",
    show: false,
  });  
  const location = useLocation();
  const [list, setList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [filteredSubcategories, setFilteredSubcategories] = useState<Category[]>([]);
  const [UIApplicable, setUIApplicable] = useState<boolean>(false);
 
  const fetchCategories = async (userstoryName: string, userstoryId: string) => {
    try { 
      const response: any = await Get("/app/Common/GetCategoriesList");
      setList(response.data || []);  
    } catch (error: any) {
      console.log(error.response.data);
    }
  };
  const distinctCategories = [...new Set(list.map(option => option.categories))];
  distinctCategories.sort((a, b) => a.localeCompare(b));


  const handleCategoryChange = (event: SelectChangeEvent) => {
    debugger
    const selectedCategoryValue = event.target.value as string;
    setSelectedCategory(selectedCategoryValue);  
   
    const filteredSubcategoriesList = list
    .filter((option: Category) => option.categories === selectedCategoryValue)
    .sort((a, b) => a.subCategory.localeCompare(b.subCategory)); 

  setFilteredSubcategories(filteredSubcategoriesList);
    
  };
  

  const handleSubCategoryChange = (event: SelectChangeEvent) => {
    debugger
    const selectedSubCategoryValue = event.target.value as string;
    const selectedSubCategory = list.find((option: Category) => option.id === selectedSubCategoryValue);
    if (selectedSubCategory) {
      setSelectedSubCategory(selectedSubCategoryValue);
      console.log(selectedSubCategory)
      setUIApplicable(selectedSubCategory.uiApplicable);     
    } else {
      // Handle the case where the selected subcategory is not found
      setSelectedSubCategory(''); // Clear the selected subcategory
      setUIApplicable(false); // Set UIApplicable to a default value
    }
  };

  const handleClose = () => {
    setErrorMsg({
      message: "",
      show: false,
    });
    setOpenDialog({ add: false }); 
    setSelectedCategory('');
    setSelectedSubCategory('');
    setFilteredSubcategories([]); 
    setUIApplicable(false)
  };

  useEffect(() => {
    if (openDialog?.add) {
      fetchCategories(userstoryName, userstoryId); 
    }
  }, [openDialog,userstoryName,userstoryId]);

  return (
    <div>
      <Dialog
        open={openDialog?.add}
        PaperProps={{
          style: { width: "40%", maxWidth: "1200px" },
        }}       
        onClose={handleClose}
      >
        <div
           style={{
            backgroundColor: "rgb(0 125 209)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DialogTitle style={{ color: "#fff", flex: "1" }}>
            Select Category
          </DialogTitle>
          <CancelOutlinedIcon
            onClick={handleClose}
            sx={{
              color: "#fff",
              fontSize: "30px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          />
        </div>
        <DialogContent
          className="row popup"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="row popup"
            style={{ justifyContent: "center", marginBottom: "2rem" }}
          >


<div
            className="row"
            style={{ justifyContent: "center", marginBottom: "4rem" }}
          >
            <FormControl className="col m-2" style={{ width: "90%" }}>
              <InputLabel id="category">Category</InputLabel>
              <Select
                labelId="category"
                required
                id="category"
                label="Category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } }}}
                style={{ width: "100%" }}
              >
                {distinctCategories.map(( Category) => (
                  <MenuItem value={Category} key={Category}>
                    {Category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div
            className="row"
            style={{ justifyContent: "center", marginBottom: "4rem" }}
          >
            <FormControl className="col m-2" style={{ width: "90%" }}>
              <InputLabel id="subCategory">Sub Category</InputLabel>
              <Select
                labelId="subCategory"
                required
                id="subCategory"
                label="Sub Category"     
                value={selectedSubCategory}   
                onChange={handleSubCategoryChange}       
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } }}}
                style={{ width: "100%" }}
              >
                {filteredSubcategories.map((option: Category) => (
                  <MenuItem value={option.id} key={option.id}>
                    {option.subCategory}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div>      
          {errorMsg.show}   
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Button onClick={handleClose} variant="contained" style={{ background: "#e3165b" }}>
  Cancel
</Button>

{selectedSubCategory && (
  UIApplicable ? (      
    <Link to="/Employee/SelectUserInterfaceList"  state={{ projectId: location.state.projectId,projectName:  location.state.projectName}} style={{ textDecoration: "none" }}> 
    <Button
      type="button"
      variant="contained"
      color="primary"
    >
      Continue To User Interface
    </Button>
    </Link>
  ) : (
    <Button
      type="button"
      variant="contained"
      color="primary"
    >
      Create Task
    </Button>
  )
)}

                            
              </div>            
          </div>
        </DialogContent>    
      </Dialog>      
    </div>
  );
};
