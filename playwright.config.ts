import { PlaywrightTestConfig, devices } from '@playwright/test';
import 'dotenv/config';

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  timeout: (Number(process.env.TEST_TIMEOUT_SEC) || 120) * 1000,
  testDir: './src/e2e/specs/',
  retries: 0,
  grep: process.env.TEST_TAG ? RegExp(process.env.TEST_TAG) : undefined,
  outputDir: process.env.OUTPUT_DIR || './test-output',
  forbidOnly: !!process.env.CI,
  expect: {
    timeout: (Number(process.env.EXPECT_TIMEOUT_SEC) || 5) * 1000,
  },
  reporter: [['list'], ['allure-playwright'], ['html', { open: 'never' }]],
  globalSetup: require.resolve(__dirname + '/global-setup.ts'),
  use: {
    trace: 'retain-on-failure',
    baseURL: process.env.BASE_URL,
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    viewport: {
      height: Number(process.env.SCREEN_HEIGHT) || 720,
      width: Number(process.env.SCREEN_WIDTH) || 1280,
    },
    contextOptions: {
      ignoreHTTPSErrors: true,
      acceptDownloads: true,
    },
  },
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS?.toLowerCase() === 'true',
        launchOptions: {
          chromiumSandbox: false,
          args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
  ],
};

export default config;
