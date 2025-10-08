export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: IntegrationStatus;
  vendor?: string;
  config: IntegrationConfig;
  created_at: string;
  updated_at: string;
  last_sync?: string;
  error_message?: string;
}

export type IntegrationType = 'fleet' | 'crm' | 'fuel' | 'custom_api';

export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'pending';

export interface IntegrationConfig {
  api_key?: string;
  api_secret?: string;
  base_url?: string;
  webhook_url?: string;
  sync_frequency?: number; // in minutes
  custom_fields?: Record<string, any>;
  [key: string]: any;
}

export interface CreateIntegrationInput {
  name: string;
  type: IntegrationType;
  vendor?: string;
  config: IntegrationConfig;
}

export interface UpdateIntegrationInput {
  name?: string;
  status?: IntegrationStatus;
  config?: Partial<IntegrationConfig>;
}

export interface IntegrationVendor {
  id: string;
  name: string;
  type: IntegrationType;
  description: string;
  logo_url?: string;
  website_url?: string;
  required_fields: string[];
  optional_fields: string[];
}

export const INTEGRATION_VENDORS: IntegrationVendor[] = [
  {
    id: 'geotab',
    name: 'Geotab',
    type: 'fleet',
    description: 'Fleet management and vehicle tracking',
    logo_url: '/logos/geotab.png',
    website_url: 'https://www.geotab.com',
    required_fields: ['api_key', 'base_url'],
    optional_fields: ['sync_frequency', 'webhook_url']
  },
  {
    id: 'samsara',
    name: 'Samsara',
    type: 'fleet',
    description: 'Connected operations platform',
    logo_url: '/logos/samsara.png',
    website_url: 'https://www.samsara.com',
    required_fields: ['api_key', 'base_url'],
    optional_fields: ['sync_frequency', 'webhook_url']
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'crm',
    description: 'Customer relationship management',
    logo_url: '/logos/salesforce.png',
    website_url: 'https://www.salesforce.com',
    required_fields: ['api_key', 'api_secret', 'base_url'],
    optional_fields: ['sync_frequency', 'webhook_url']
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    type: 'crm',
    description: 'Inbound marketing and sales platform',
    logo_url: '/logos/hubspot.png',
    website_url: 'https://www.hubspot.com',
    required_fields: ['api_key', 'base_url'],
    optional_fields: ['sync_frequency', 'webhook_url']
  },
  {
    id: 'fuelmaster',
    name: 'FuelMaster',
    type: 'fuel',
    description: 'Fuel management and monitoring',
    logo_url: '/logos/fuelmaster.png',
    website_url: 'https://www.fuelmaster.com',
    required_fields: ['api_key', 'base_url'],
    optional_fields: ['sync_frequency', 'webhook_url']
  },
  {
    id: 'custom',
    name: 'Custom API',
    type: 'custom_api',
    description: 'Connect to your custom API endpoint',
    logo_url: '/logos/custom.png',
    website_url: '',
    required_fields: ['base_url'],
    optional_fields: ['api_key', 'api_secret', 'sync_frequency', 'webhook_url']
  }
];