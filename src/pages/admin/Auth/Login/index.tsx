import React from 'react';
import { Button, Checkbox, Form, Input, notification } from 'antd';
import { useLoginMutation } from '../../../auth.service';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { setAdminAuthenticated } from '../../../auth.slice';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
  const [form] = Form.useForm();
  const [login, loginResult] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = (formValues: { email: string; password: string }) => {
    console.log('Success:', formValues);

    const adminCredentials: { email: string; password: string } = {
      email: formValues.email,
      password: formValues.password
    };

    login(adminCredentials)
      .then((result) => {
        console.log(result);

        if ('data' in result) {
          console.log(result.data);

          const loginResponse: { token: string; message: string; userId: string } = result.data;
          const decodedToken: { exp: number; iat: number; userId: string; email: string } = jwtDecode(
            loginResponse.token
          );

          localStorage.setItem('adminToken', loginResponse.token);
          const expirationTime = decodedToken.exp * 1000; // Expiration time in milliseconds
          console.log(decodedToken);

          // Check if the token has not expired
          if (Date.now() < expirationTime) {
            // Token is valid, dispatch action to set authentication state
            dispatch(setAdminAuthenticated(loginResponse.token));
            form.resetFields();
            notification.success({ type: 'success', message: loginResponse.message, duration: 2 });

            setTimeout(() => {
              navigate('/author/dashboard');
            }, 2000);
          } else {
            // Token has expired, handle accordingly (e.g., prompt user to log in again)
            console.log('Token has expired. Please log in again.');
          }
        }

        // Handling error failed login here
        // if ('error' in result) {
        //   if ('status' in result.error) {
        //     console.log('show notification!');
        //   }
        // }
        // if (result.error.status === 500) {
        //   console.log('show notification!');
        // }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      form={form}
      name='basic'
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete='off'
    >
      <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label='Password' name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item name='remember' valuePropName='checked' wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type='primary' htmlType='submit'>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AdminLogin;
