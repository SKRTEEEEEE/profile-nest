import { ArgumentMetadata } from '@nestjs/common';
import { GlobalValidationPipe } from 'src/shareds/presentation/pipes/global.validation';
import { IsString, IsNumber } from 'class-validator';

class TestDto {
  @IsString()
  name: string;

  @IsNumber()
  age: number;
}

describe('GlobalValidationPipe', () => {
  let pipe: GlobalValidationPipe;

  beforeEach(() => {
    pipe = new GlobalValidationPipe();
  });

  describe('transform', () => {
    it('should pass validation with correct data', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: TestDto,
        data: '',
      };

      const value = { name: 'John', age: 30 };
      const result = await pipe.transform(value, metadata);

      expect(result).toBeInstanceOf(TestDto);
      expect(result.name).toBe('John');
      expect(result.age).toBe(30);
    });

    it('should throw error when validation fails', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: TestDto,
        data: '',
      };

      const value = { name: 'John', age: 'not-a-number' };

      await expect(pipe.transform(value, metadata)).rejects.toThrow();
    });

    it('should throw error when required query params are missing', async () => {
      const metadata: ArgumentMetadata = {
        type: 'query',
        metatype: TestDto,
        data: '',
      };

      await expect(pipe.transform(undefined, metadata)).rejects.toThrow();
    });

    it('should throw error for empty query object', async () => {
      const metadata: ArgumentMetadata = {
        type: 'query',
        metatype: TestDto,
        data: '',
      };

      await expect(pipe.transform({}, metadata)).rejects.toThrow();
    });

    it('should throw error for null query params', async () => {
      const metadata: ArgumentMetadata = {
        type: 'query',
        metatype: TestDto,
        data: '',
      };

      await expect(pipe.transform(null, metadata)).rejects.toThrow();
    });

    it('should pass for primitive types without validation', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: String,
        data: '',
      };

      const result = await pipe.transform('test', metadata);
      expect(result).toBe('test');
    });

    it('should pass for Number type without validation', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Number,
        data: '',
      };

      const result = await pipe.transform(123, metadata);
      expect(result).toBe(123);
    });

    it('should pass for Boolean type without validation', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Boolean,
        data: '',
      };

      const result = await pipe.transform(true, metadata);
      expect(result).toBe(true);
    });

    it('should pass for Array type without validation', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Array,
        data: '',
      };

      const result = await pipe.transform([1, 2, 3], metadata);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should reject forbidden properties', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: TestDto,
        data: '',
      };

      const value = { name: 'John', age: 30, extraField: 'not-allowed' };

      await expect(pipe.transform(value, metadata)).rejects.toThrow();
    });

    it('should reject missing required properties', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: TestDto,
        data: '',
      };

      const value = { name: 'John' }; // missing age

      await expect(pipe.transform(value, metadata)).rejects.toThrow();
    });
  });
});
