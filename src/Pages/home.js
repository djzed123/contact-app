import React from 'react'
import AllContactsTable from '../Components/Assets/all-contacts-table';
import Header from '../Components/Navigation/header';
import Card from '../Components/UI/Card';

function Home() {
  return (
    <>
      <Header />
      <Card>
        <AllContactsTable />
      </Card>
    </>
  )
}

export default Home;
