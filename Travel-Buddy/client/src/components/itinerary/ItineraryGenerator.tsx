import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, Form, Input, Select, Spin, Alert, Divider, Typography, FormInstance } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import type { Rule } from 'antd/es/form';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

type Budget = 'low' | 'medium' | 'high';

interface ItineraryFormValues {
  destination: string;
  duration: string; // Form values are always strings
  interests: string[];
  budget: Budget;
}

interface ItineraryRequest {
  destination: string;
  duration: number;
  interests: string[];
  budget: 'low' | 'medium' | 'high';
}

const interestOptions = [
  'Adventure', 'Beaches', 'Cultural', 'Food', 'History', 'Nature',
  'Nightlife', 'Relaxation', 'Shopping', 'Sightseeing', 'Sports', 'Wildlife'
];

const ItineraryGenerator = () => {
  const [form] = Form.useForm<ItineraryFormValues>();
  const [itinerary, setItinerary] = useState<string>('');

  const generateItinerary = async (values: ItineraryRequest) => {
    const response = await fetch('/api/ai/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to generate itinerary');
    }

    const data = await response.json();
    return data.data.itinerary;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (values: ItineraryFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const request: ItineraryRequest = {
        ...values,
        duration: parseInt(values.duration, 10)
      };
      
      console.log('Submitting itinerary request:', request);
      
      const response = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
      });

      // First, get the response as text to handle potential non-JSON responses
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        console.error('Response text:', responseText);
        throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`);
      }

      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      });

      if (!response.ok) {
        const errorMessage = responseData?.error || 
                           responseData?.message || 
                           response.statusText || 
                           'Failed to generate itinerary';
        throw new Error(`Server error (${response.status}): ${errorMessage}`);
      }

      if (!responseData?.data?.itinerary) {
        console.error('Invalid response format - missing itinerary:', responseData);
        throw new Error('Invalid response format from server');
      }

      setItinerary(responseData.data.itinerary);
    } catch (err) {
      console.error('Form submission failed:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card title="AI Travel Itinerary Generator" className="mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            duration: '3',
            budget: 'medium',
            interests: [],
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Form.Item<ItineraryFormValues>
              name="destination"
              label="Destination"
              rules={[{
                required: true,
                message: 'Please enter a destination',
                validator: (_, value: string) => {
                  if (!value || typeof value !== 'string' || value.trim() === '') {
                    return Promise.reject(new Error('Please enter a valid destination'));
                  }
                  return Promise.resolve();
                }
              }]}
            >
              <Input placeholder="e.g., Paris, France" size="large" />
            </Form.Item>

            <Form.Item
              name="duration"
              label="Duration (days)"
              rules={[
                { 
                  required: true, 
                  message: 'Please enter duration',
                },
                {
                  validator: (_, value: string) => {
                    const num = parseInt(value, 10);
                    if (isNaN(num) || num < 1 || num > 30) {
                      return Promise.reject(new Error('Duration must be between 1 and 30 days'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" min={1} max={30} size="large" />
            </Form.Item>
          </div>

          <Form.Item
            name="interests"
            label="Interests"
            className="mb-4"
            rules={[
              {
                validator: (_, value: string[] = []) => {
                  if (value.length === 0) {
                    return Promise.reject(new Error('Please select at least one interest'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select your interests"
              size="large"
              optionFilterProp="children"
              filterOption={(input, option) => {
                const label = Array.isArray(option?.label) 
                  ? option.label.join('') 
                  : String(option?.label ?? '');
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {interestOptions.map((interest) => (
                <Option key={interest} value={interest.toLowerCase()}>
                  {interest}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item<Budget>
            name="budget"
            label="Budget"
            className="mb-4"
            rules={[{ required: true, message: 'Please select a budget' }]}
          >
            <Select size="large">
              <Option value="low">💰 Low Budget</Option>
              <Option value="medium">💰💰 Medium Budget</Option>
              <Option value="high">💰💰💰 High Budget</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Generating...' : 'Generate Itinerary'}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {error && (
        <Alert
          message="Error"
          description={error instanceof Error ? error.message : 'Failed to generate itinerary'}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      {isSubmitting ? (
        <div className="flex justify-center items-center p-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : itinerary ? (
        <Card title="Your Travel Itinerary" className="mt-6">
          <div className="whitespace-pre-line mb-4">{itinerary}</div>
          <div className="flex justify-end">
            <Button 
              type="primary" 
              onClick={() => window.print()}
              className="print:hidden"
            >
              Print Itinerary
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default ItineraryGenerator;
