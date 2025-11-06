import {
  DomainError,
  DatabaseActionError,
  DatabaseFindError,
  SetEnvError,
  InputParseError,
  UnauthorizedError,
  NotImplementedError,
  SharedActionError,
  ThrottleError,
} from '../../../src/domain/flows/domain.error';
import { ErrorCodes } from '../../../src/domain/flows/error.type';

describe('Domain Errors', () => {
  class MockLocation {
    constructor() {}
  }

  const mockLocation = MockLocation;
  const mockFunction = 'testFunction';

  describe('DomainError (base class)', () => {
    class TestDomainError extends DomainError {
      constructor() {
        super('Test message', ErrorCodes.DATABASE_ACTION, mockLocation, mockFunction);
      }
    }

    it('should create a domain error with required properties', () => {
      const error = new TestDomainError();
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toBe('Test message');
      expect(error.type).toBe(ErrorCodes.DATABASE_ACTION);
      expect(error.location).toBe(mockLocation);
      expect(error.func).toBe(mockFunction);
      expect(error.success).toBe(false);
      expect(error.timestamp).toBeGreaterThan(0);
      expect(error.name).toBe('TestDomainError');
    });

    it('should accept optional friendly description and meta', () => {
      class TestDomainErrorWithOptions extends DomainError {
        constructor() {
          super(
            'Test message',
            ErrorCodes.DATABASE_ACTION,
            mockLocation,
            mockFunction,
            { es: 'Descripción', en: 'Description', ca: 'Descripció', de: 'Beschreibung' },
            { shortDesc: 'Short description' }
          );
        }
      }

      const error = new TestDomainErrorWithOptions();
      expect(error.friendlyDesc).toEqual({
        es: 'Descripción',
        en: 'Description',
        ca: 'Descripció',
        de: 'Beschreibung',
      });
      expect(error.meta).toEqual({ shortDesc: 'Short description' });
    });
  });

  describe('DatabaseActionError', () => {
    it('should create database action error without entity', () => {
      const error = new DatabaseActionError(mockLocation, mockFunction);
      
      expect(error.message).toBe(`Db ${mockFunction} doesn't worked. `);
      expect(error.type).toBe(ErrorCodes.DATABASE_ACTION);
    });

    it('should create database action error with entity', () => {
      const error = new DatabaseActionError(
        mockLocation,
        mockFunction,
        undefined,
        { entity: 'User', optionalMessage: 'Connection failed' }
      );
      
      expect(error.message).toBe(`Db ${mockFunction} (for User) doesn't worked. Connection failed`);
    });
  });

  describe('DatabaseFindError', () => {
    it('should create database find error without entity', () => {
      const error = new DatabaseFindError(mockLocation, mockFunction);
      
      expect(error.message).toBe(`Db read ${mockFunction} doesn't worked. `);
      expect(error.type).toBe(ErrorCodes.DATABASE_FIND);
    });

    it('should create database find error with entity', () => {
      const error = new DatabaseFindError(
        mockLocation,
        mockFunction,
        undefined,
        { entity: 'Project', optionalMessage: 'Not found' }
      );
      
      expect(error.message).toBe(`Db ${mockFunction} (for Project) doesn't worked. Not found`);
    });
  });

  describe('SetEnvError', () => {
    it('should create environment variable error without variable name', () => {
      const error = new SetEnvError(mockLocation, mockFunction);
      
      expect(error.message).toBe(`Env variable necessary for ${mockFunction} isn't set correctly. `);
      expect(error.type).toBe(ErrorCodes.SET_ENV);
    });

    it('should create environment variable error with variable name', () => {
      const error = new SetEnvError(
        mockLocation,
        mockFunction,
        undefined,
        { variable: 'DATABASE_URL', optionalMessage: 'Missing configuration' }
      );
      
      expect(error.message).toBe(`Env variable DATABASE_URL necessary for ${mockFunction} isn't set correctly. Missing configuration`);
    });
  });

  describe('InputParseError', () => {
    it('should create input parse error', () => {
      const error = new InputParseError(
        mockLocation,
        mockFunction,
        undefined,
        { optionalMessage: 'Invalid JSON format' }
      );
      
      expect(error.message).toBe('Error parsing inputs. Invalid JSON format');
      expect(error.type).toBe(ErrorCodes.INPUT_PARSE);
    });
  });

  describe('UnauthorizedError', () => {
    it('should create unauthorized error', () => {
      const error = new UnauthorizedError(
        mockLocation,
        mockFunction,
        undefined,
        { optionalMessage: 'Invalid token' }
      );
      
      expect(error.message).toBe('Unauthorized. Invalid token');
      expect(error.type).toBe(ErrorCodes.UNAUTHORIZED_ACTION);
    });
  });

  describe('NotImplementedError', () => {
    it('should create not implemented error', () => {
      const error = new NotImplementedError(
        mockLocation,
        mockFunction,
        undefined,
        { optionalMessage: 'Feature coming soon' }
      );
      
      expect(error.message).toBe('Not Implemented. Feature coming soon');
      expect(error.type).toBe(ErrorCodes.NOT_IMPLEMENTED);
    });
  });

  describe('SharedActionError', () => {
    it('should create shared action error without entity', () => {
      const error = new SharedActionError(mockLocation, mockFunction);
      
      expect(error.message).toBe(`Shared ${mockFunction} didn't work. `);
      expect(error.type).toBe(ErrorCodes.SHARED_ACTION);
    });

    it('should create shared action error with entity', () => {
      const error = new SharedActionError(
        mockLocation,
        mockFunction,
        undefined,
        { entity: 'Email', optionalMessage: 'SMTP error' }
      );
      
      expect(error.message).toBe(`Shared ${mockFunction} (for Email) didn't work. SMTP error`);
    });
  });

  describe('ThrottleError', () => {
    it('should create throttle error', () => {
      const error = new ThrottleError(
        mockLocation,
        mockFunction,
        undefined,
        { optionalMessage: 'Rate limit exceeded' }
      );
      
      expect(error.message).toBe('Too many requests. Rate limit exceeded');
      expect(error.type).toBe(ErrorCodes.THROTTLE);
    });
  });
});
