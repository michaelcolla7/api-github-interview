import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight, FiFolder } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api from '../../services/user';

import imgLogo from '../../assets/logo.svg';

import { Header, Title, Form, Users, Error } from './styles';

interface UserData {
  login: string;
  avatar_url: string;
  html_url: string;
}

const User: React.FC = () => {
  const [newUser, setNewUser] = useState('');
  const [inputError, setinputError] = useState('');

  const [users, setUsers] = useState<UserData[]>(() => {
    const storagedUsers = localStorage.getItem('@GitHubExplorer:users');

    if (storagedUsers) {
      return JSON.parse(storagedUsers);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('@GitHubExplorer:users', JSON.stringify(users));
  }, [users]);

  async function handleAddUser(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newUser) {
      setinputError('Digite o nome do usuário');
      return;
    }

    try {
      const response = await api.get<UserData>(`${newUser}`);
      const repository = response.data;

      setUsers([...users, repository]);
      setNewUser('');
      setinputError('');
    } catch {
      setinputError('Usuário não encontrado');
    }
  }

  return (
    <>
      <Header>
        <img src={imgLogo} alt="Github Explorer" />
        <Link to="/">
          <FiFolder size={16} />
          Repos
        </Link>
      </Header>
      <Title>Explore usuários no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddUser}>
        <input
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
          placeholder="Digite o nome do usuário"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Users>
        {users.map(user => (
          <Link key={user.login} to={`user/${user.login}`}>
            <img src={user.avatar_url} alt={user.login} />
            <div>
              <strong>{user.login}</strong>
              <p>{user.html_url}</p>
            </div>

            <FiChevronRight size="20" />
          </Link>
        ))}
      </Users>
    </>
  );
};

export default User;
