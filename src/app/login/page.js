'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import Link from 'next/link';
import { useLoginMutation } from '@/lib/api/authApi';
import { setCredentials } from '@/lib/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

// Zod schema (works perfectly in JS too)
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Styled components (same beautiful design)
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #718096;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  /* Ensure input text is high contrast */
  color: #1a202c;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;


const ErrorText = styled.p`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Button = styled.button`
  padding: 0.875rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GlobalError = styled.div`
  background: #fed7d7;
  color: #c53030;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const SignupLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #718096;
  font-size: 0.875rem;

  a {
    color: #667eea;
    font-weight: 600;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
const [ error, setError]=useState("")
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
 
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
  
    try {
      setError('')
      const result = await login(data).unwrap()
      console.log("Login successful:", result)
      
      // Check if user is admin
      if (result.user.role !== 'admin') {
        setError('Only administrators can access this panel')
        return
      }

      // Store credentials in Redux
      dispatch(setCredentials(result))
      
      // Redirect to admin dashboard
      router.push('/admin/dashboard')
    } catch (err) {
      console.error("Login error:", err)
      console.error("Error details:", {
        status: err.status,
        data: err.data,
        message: err.message
      })
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (err.status === 'FETCH_ERROR') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running on http://localhost:3000'
      } else if (err.status === 404) {
        errorMessage = 'API endpoint not found. Please check the server configuration.'
      } else if (err.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (err.data?.message) {
        errorMessage = err.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    }
  }

  return (
    <Container>
      <Card>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account</Subtitle>

        {/* Global server error */}
        {error && <GlobalError>{error}</GlobalError>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </FormGroup>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>

        <SignupLink>
          Don't have an account? <Link href="/signup">Sign up</Link>
        </SignupLink>
      </Card>
    </Container>
  );
}