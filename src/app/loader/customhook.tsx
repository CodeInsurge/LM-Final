// withLoading.js
import React, { useState } from 'react';
import  Componentspinner  from './loader';

const withLoadingsppiner = (WrappedComponent: any) => {
  return function WithLoading(props: any) {

    const [loading, setLoading] = useState(true);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    
      return loading ? <Componentspinner /> : <WrappedComponent {...props} />;
  };
};

export default withLoadingsppiner;
