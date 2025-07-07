import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../Data/firebase';
import Loader from '../Loader/Loader';

function ProtectedAdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().isAdmin === true) {
          setIsAllowed(true);
        } else {
          setIsAllowed(false);
        }
      } else {
        setIsAllowed(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loader/>;

  return isAllowed ? children : <Navigate to="/" />;
}

export default ProtectedAdminRoute;
