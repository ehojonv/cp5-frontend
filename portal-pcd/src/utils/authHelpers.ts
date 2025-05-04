// Interfaces
export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
  }
  
  export interface AuthToken {
    id: string;
    name: string;
    email: string;
  }
  
  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null; 
    
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  };
  
  const setCookie = (name: string, value: string, days: number): void => {
    if (typeof document === 'undefined') return; 
    
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expirationDate.toUTCString()}; path=/`;
  };
  
  const removeCookie = (name: string): void => {
    if (typeof document === 'undefined') return; 
    
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };
  
  export const isAuthenticated = (): boolean => {
    const token = getCookie('auth-token');
    return !!token;
  };
  
  export const getAuthUser = (): AuthToken | null => {
    const token = getCookie('auth-token');
    if (!token) return null;
    
    try {
      return JSON.parse(token);
    } catch (error) {
      console.error('Erro ao analisar token de autenticação:', error);
      return null;
    }
  };
  
 
  export const login = (userData: AuthToken): void => {
    setCookie('auth-token', JSON.stringify(userData), 1); // Expira em 1 dia
  };
  
  export const logout = (): void => {
    removeCookie('auth-token');
  };
  
  export const saveUser = (user: User): void => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      const userExists = users.some((u: User) => u.email === user.email);
      
      if (userExists) {
        throw new Error('Usuário com este e-mail já existe');
      }
      
      users.push(user);
      
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  };
  
  export const getUsers = (): User[] => {
    try {
      return JSON.parse(localStorage.getItem('users') || '[]');
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  };
  
  export const updateUser = (userId: string, userData: Partial<User>): boolean => {
    try {
      const users = getUsers();
      const userIndex = users.findIndex((u: User) => u.id === userId);
      
      if (userIndex === -1) return false;
      
      users[userIndex] = { ...users[userIndex], ...userData };
      
      localStorage.setItem('users', JSON.stringify(users));
      
      const authUser = getAuthUser();
      if (authUser && authUser.id === userId) {
        const updatedAuthData: AuthToken = {
          id: users[userIndex].id,
          name: users[userIndex].name,
          email: users[userIndex].email
        };
        
        setCookie('auth-token', JSON.stringify(updatedAuthData), 1);
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return false;
    }
  };