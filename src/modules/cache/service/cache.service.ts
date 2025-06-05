import { ENV } from '@/config/environment.config';
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(CacheService.name);

  constructor() {
    this.client = new Redis(ENV.REDIS.URL, { lazyConnect: true });

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err);
    });

    this.client.on('ready', () => {
      this.logger.log('Redis Client Ready');
    });

    this.client.on('reconnecting', () => {
      this.logger.log('Redis Client Reconnecting');
    });

    this.client.on('connect', () => {
      this.logger.log('Redis Client Connected');
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
    } catch (err) {
      this.logger.error('Failed to connect to Redis', err);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch (err) {
      this.logger.error('Failed to disconnect from Redis', err);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Lỗi khi lấy dữ liệu từ Redis với key: ${key}`, error);
      return null;
    }
  }

  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const data = await this.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(`Lỗi khi parse JSON từ Redis với key: ${key}`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    try {
      if (ttlSeconds) {
        await this.client.set(key, value, 'EX', ttlSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Lỗi khi lưu dữ liệu vào Redis với key: ${key}`, error);
    }
  }

  async setJSON(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await this.set(key, stringValue, ttlSeconds);
    } catch (error) {
      this.logger.error(`Lỗi khi lưu JSON vào Redis với key: ${key}`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Lỗi khi xóa dữ liệu từ Redis với key: ${key}`, error);
    }
  }

  async getOrSet<T>(key: string, fetchFn: () => Promise<T> | T, ttlSeconds?: number): Promise<T> {
    try {
      const cachedData = await this.getJSON<T>(key);
      if (cachedData !== null) {
        return cachedData;
      }

      const data = await fetchFn();
      await this.setJSON(key, data, ttlSeconds);
      return data;
    } catch (error) {
      this.logger.error(`Lỗi trong getOrSet với key: ${key}`, error);
      return await fetchFn();
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.client.incr(key);
    } catch (error) {
      this.logger.error(`Lỗi khi tăng giá trị trong Redis với key: ${key}`, error);
      return -1;
    }
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.client.expire(key, seconds);
      return result === 1;
    } catch (error) {
      this.logger.error(`Lỗi khi đặt thời gian hết hạn cho key: ${key}`, error);
      return false;
    }
  }

  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      this.logger.error(`Lỗi khi lấy thời gian sống cho key: ${key}`, error);
      return -2;
    }
  }

  async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      this.logger.error(`Lỗi khi lấy danh sách keys với pattern: ${pattern}`, error);
      return [];
    }
  }

  async flushDb(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      this.logger.error('Lỗi khi xóa toàn bộ dữ liệu Redis', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Lỗi khi kiểm tra tồn tại Redis với key: ${key}`, error);
      return false;
    }
  }
}
