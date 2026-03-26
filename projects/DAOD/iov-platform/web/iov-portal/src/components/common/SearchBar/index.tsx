/**
 * 搜索栏组件
 * 
 * @description 通用搜索表单
 * @author daod-team
 */

import React from 'react';
import { Form, Input, Select, Button, Space, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface SearchField {
  name: string;
  label: string;
  type?: 'input' | 'select';
  placeholder?: string;
  options?: { label: string; value: any }[];
  span?: number;
}

interface SearchBarProps {
  fields: SearchField[];
  onSearch: (values: any) => void;
  onReset?: () => void;
  loading?: boolean;
  defaultValues?: Record<string, any>;
  span?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  fields,
  onSearch,
  onReset,
  loading = false,
  defaultValues,
  span = 6,
}) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={defaultValues}
      onFinish={handleSearch}
    >
      <Row gutter={16}>
        {fields.map((field) => (
          <Col key={field.name} span={field.span || span}>
            <Form.Item name={field.name} label={field.label}>
              {field.type === 'select' ? (
                <Select
                  placeholder={field.placeholder || `请选择${field.label}`}
                  options={field.options}
                  allowClear
                />
              ) : (
                <Input
                  placeholder={field.placeholder || `请输入${field.label}`}
                  allowClear
                />
              )}
            </Form.Item>
          </Col>
        ))}
        <Col span={span}>
          <Form.Item label=" ">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
              >
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;