import React, { use, useEffect, useState } from 'react'
import {Page, Layout, LegacyCard} from '@shopify/polaris';

function  User() {

// const fetch = useAuthenticatedFetch();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/getusers");
        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await res.json();
        // console.log('data: ', data);
        setUsers(data);
      } catch (err) {
        console.error("Error:", err);
        setError("Unable to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  console.log("users: ", users);

  return (
    <div className='users-data'>
      <Page>
      <Layout sectioned>
        <Layout.Section>
          <LegacyCard title="Online store dashboard" sectioned>
            <ul>
              <li>
                <span>Name</span>
                <span>Email</span>
              </li>
              { users && users.map((user) => (
                  <li key={user._id}>
                    <span>{user.username}</span>
                    <span>{user.useremail}</span>
                  </li>
                ))
              }
            </ul>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
    </div>
  )
}

export default User