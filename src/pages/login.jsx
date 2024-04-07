import React from 'react';
import Swal from "sweetalert2";
import {Button} from "antd";


const Login = () => {
    return (
      <Button onClick={() => Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Why do I have this issue?</a>'
      })}/>
    );
};

export default Login;