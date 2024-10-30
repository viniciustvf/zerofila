import { Empresa } from './empresa.entity';

describe('Empresa class', () => {
  it('should make a empresa with no fields', () => {
    const empresa = new Empresa('', '', '', '', '');
    expect(empresa).toBeTruthy();
    expect(empresa.name).toBe('');
    expect(empresa.email).toBe('');
    expect(empresa.username).toBe('');
    expect(empresa.password).toBe('');
  });
  it('should make a empresa with fields', () => {
    const empresa = new Empresa(
      '1',
      'name#1',
      'test@example.com',
      'username#1',
      'password#1',
    );
    expect(empresa).toBeTruthy();
    expect(empresa.name).toBe('name#1');
    expect(empresa.email).toBe('test@example.com');
    expect(empresa.username).toBe('username#1');
    expect(empresa.password).toBe('password#1');
  });
  it('should make a empresa with name only', () => {
    const empresa = new Empresa('1', 'name#1', '', '', '');
    expect(empresa).toBeTruthy();
    expect(empresa.name).toBe('name#1');
    expect(empresa.email).toBe('');
    expect(empresa.username).toBe('');
    expect(empresa.password).toBe('');
  });
  it('should make a empresa with name and email', () => {
    const empresa = new Empresa('1', 'name#1', 'test@example.com', '', '');
    expect(empresa).toBeTruthy();
    expect(empresa.name).toBe('name#1');
    expect(empresa.email).toBe('test@example.com');
    expect(empresa.username).toBe('');
    expect(empresa.password).toBe('');
  });

  it('should make a empresa with name, email and username', () => {
    const empresa = new Empresa('1', 'name#1', 'test@example.com', 'username#1', '');
    expect(empresa).toBeTruthy();
    expect(empresa.name).toBe('name#1');
    expect(empresa.email).toBe('test@example.com');
    expect(empresa.username).toBe('username#1');
    expect(empresa.password).toBe('');
  });
});
