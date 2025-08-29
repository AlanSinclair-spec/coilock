import { createClient } from './client';

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await createClient().auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await createClient().auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await createClient().auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await createClient().auth.getUser();
  return user;
};
