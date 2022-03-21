import React, { useState, useEffect, useCallback } from "react";
import { DataGrid } from "devextreme-react";
import {
  Paging,
  Editing,
  Column,
  Popup,
  FilterRow,
  Form,
  Lookup,
} from "devextreme-react/data-grid";
import { Item, NumericRule, EmailRule, ButtonItem } from 'devextreme-react/form';
import useHttp from "../../Hooks/use-http";
import "devextreme/dist/css/dx.light.css";

const notesEditorOptions = { height: 100 };


const AllContactsTable = () => {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const { isLoading2, error2, sendRequest: sendUpdateRequest } = useHttp();
  
  const transformContacts = (contactsObj) => {
    const loadedContacts = [];

    for (const key in contactsObj) { 
      loadedContacts.push({
        id: contactsObj[key].id,
        FirstName: contactsObj[key].firstName,
        LastName: contactsObj[key].lastName,
        FullName: contactsObj[key].firstName + ' ' + contactsObj[key].lastName,
        Phone: contactsObj[key].phone,
        Address: contactsObj[key].address,
        Email: contactsObj[key].email,
        DateLastContact: contactsObj[key].dateLastContact,
        Comments: contactsObj[key].comments,
        Company: contactsObj[key].fkCompanyId,
      });
    }

    setContacts(loadedContacts);
  };

  const transformCompanies = (companiesObj) => {
    const loadedCompanies = [];

    for (const key in companiesObj) { 
      loadedCompanies.push({
        id: companiesObj[key].id,
        Name: companiesObj[key].name,
      });
    }

    setCompanies(loadedCompanies);
  };

  const httpData = useHttp(
    {
      url: "https://localhost:7277/api/People",
      //url: "https://react-training-ed231-default-rtdb.firebaseio.com/assets.json",
    },
    transformContacts
  );

  const companyData = useHttp(
    {
      url: "https://localhost:7277/api/Companies",
      //url: "https://react-training-ed231-default-rtdb.firebaseio.com/assets.json",
    },
    transformCompanies
  );

  
  //fetchAssets is an alias for the sendRequest function name
  const { isLoading, error, sendRequest: fetchContacts } = httpData;
  const { isLoadingCompanies, errorCompanies, sendRequest: fetchCompanies } = companyData;

  
  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, []);

  //console.log(companies);

  const onEditingStart = () => {
    console.log("Edit Started!");
  };

  const [pageSizes] = useState([5, 10, 15, 0]);

  const companiesLookup = {
    store: {
      type: "array",
      data: companies,
      key: "id",
    },
  };

  const onSave = (e) => {
    const json = e.changes;
    const contactJson = json[0].data;

    //first check for either an insert or update
    let url = "";
    if(json[0].type === "update") {
      //if update, then we need the key of the contact being updated
      const idToBeUpdated = json[0].key;
      url = "https://localhost:7277/api/People/" + idToBeUpdated;
      upadateContactHandler(url, contactJson);
    }
    if(json[0].type === "insert") {
      insertContactHandler(contactJson);
    }

  };

  const upadateContactHandler = async (url, contactJson) => {
    try {
      let today = new Date().toISOString().slice(0, 10)
      const response = await fetch(
        url,
        {
          method: 'PUT',
          body: JSON.stringify({
            id: contactJson.id,
            firstName: contactJson.FirstName,
            lastName: contactJson.LastName,
            jobTitle: "Janitor",
            fkCompanyId: contactJson.Company,
            address: contactJson.Address,
            city: "",
            fkProvinceId: 1,
            postalCode: "T5R4E3",
            phone: contactJson.Phone,
            email: contactJson.Email,
            comments: contactJson.Comments,
            dateLastContact: today }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();

    } catch (err) {
      console.log(err);
    }
    
  };

  const insertContactHandler = async (contactJson) => {
    try {
      let today = new Date().toISOString().slice(0, 10)
      const response = await fetch(
        'https://localhost:7277/api/People',
        {
          method: 'POST',
          body: JSON.stringify({
            firstName: contactJson.FirstName,
            lastName: contactJson.LastName,
            jobTitle: "CEO",
            fkCompanyId: contactJson.Company,
            address: contactJson.Address,
            city: "",
            fkProvinceId: 1,
            postalCode: "T5R4E3",
            phone: contactJson.Phone,
            email: contactJson.Email,
            comments: contactJson.Comments,
            dateLastContact: today }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Request failed!');
      }

      const data = await response.json();

    } catch (err) {
      console.log(err);
    }
    
  };

  
  return (
    <DataGrid
      id="gridContainer"
      dataSource={contacts}
      keyExpr="id"
      //onEditingStart={onEditingStart}
      onSaved={onSave}
      showBorders={true}
    >
      <FilterRow visible={true} />
      <Paging defaultPageIndex={0} defaultPageSize={20} />
      <Editing mode="popup" allowUpdating={true} allowAdding={true} allowDeleting={false} >
        <Popup title="Contact Details" showTitle={true} width={700} height={525} />
        <Form>
          <Item itemType="group" colCount={2} colSpan={2}>
            <Item dataField="FirstName" isRequired={true} />
            <Item dataField="LastName" isRequired={true} />
            <Item dataField="Address" isRequired={true} />
            <Item dataField="Phone" isRequired={true} >
              <NumericRule />
            </Item>
            <Item dataField="Email" isRequired={true} >
              <EmailRule />
            </Item>
            <Item dataField="DateLastContact" />
            <Item dataField="Company" displayExpr="Name" />
            <Item
              dataField="Comments"
              editorType="dxTextArea"
              colSpan={2}
              editorOptions={notesEditorOptions} />
          </Item>

        </Form>
      </Editing>
      {/* <Column dataField="FullName" caption="Name" /> */}
      <Column dataField="FirstName" caption="FirstName" />
      <Column dataField="LastName" caption="LastName" />
      <Column dataField="Phone" caption="Phone" />
      <Column dataField="Address" caption="Address" />
      <Column dataField="Email" caption="Email" />
      <Column dataField="DateLastContact" caption="Last Date Contacted" />
      <Column dataField="Company" visible={false}>
        <Lookup dataSource={companies} displayExpr="Name" valueExpr="id" />
      </Column>
    </DataGrid>
  );
};

export default AllContactsTable;
