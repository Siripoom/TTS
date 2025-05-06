import React, { useState, useForm, useEffect } from 'react'
import { Card, Row, Col, Typography, Statistic, Table, Flex, Button, Modal, Form, Input, DatePicker, InputNumber, message } from "antd"
import { BuildOutlined, DeleteFilled, EyeFilled, HomeOutlined, ToolOutlined } from "@ant-design/icons"
import dayjs from 'dayjs'
import { getCustomers, getInvoiceCustomer, getSuppliers } from '../../services/api'


const { Title } = Typography
const InvoiceCustomer = () => {
    const [showModal, setShowModal] = useState(false)
    const [showModalDelate, setShowModalDelete] = useState(false)
    const [showDeawer, setShowDeawer] = useState(false)
    const [customer, setCustomer] = useState(null)
    const [supplier, setSupplier] = useState(null)
    const [invoices, setInvoices] = useState([])
    const [selectedSupplier, setSelectedSupplier] = useState(null)
    const [selectedInvoice, setSelectedInvoice] = useState(null)
    const [form] = Form.useForm()
    const token = localStorage.getItem('token')


    const fetchInvoicesCustomer = async () => {
        try {
            const res = await getInvoiceCustomer(token);
            if(!res.succes ){
                message.error(res.message)
                console.log(res)
            }
            setInvoices(res.data)
        } catch (error) {
            console.log(error) 

        }
    }

    const  fetchCustomer = async () => {
        try{
            const res = await getCustomers(token);
            if(!res.succes ){
                message.error(res.message)
                console.log(res)
            }
            setCustomer(res.data)
        }catch (error) {
            console.log(error)
        }
    }

    const fetchSupplier = async () => {
        try {
            const res = await getSuppliers(token);
            if(!res.succes ){
                message.error(res.message)
                console.log(res)
            }
            setSupplier(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchInvoicesCustomer();
        fetchCustomer();
        fetchSupplier();
    }, [])
    const showModalForm = (record = null) => {
        setSelectedInvoice(record)
        if (record) {
            form.setFieldsValue({
                id: record.id,
                dueDate: dayjs(record.dueDate),
                customer: record.customer,
                totalAmount: record.totalAmount,
            })
        } else {
            form.resetFields()
        }
        setShowModal(true);
    }

    const closeModalForm = () => {
        setShowModal(false);
        setSelectedInvoice(null);
        form.resetFields()
    }

    const handleFinish = () => {
        console.log("Submit Form")
    }
    const columns = [
        {
            title: 'เลขที่ใบวางบิล',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'วันที่',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => {
                dayjs(date).format('DD/MM/YYYY')
            }
        },
        {
            title: 'ชื่อลูกค้า',
            dataIndex: 'customer',
            key: 'customer',
            render: (customer) => customer.name || '-'
        },
        {
            title: 'ราคารวม',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
        },
        {
            title: 'ACTIONS',
            key: 'actions',
            render: (_, record) => {
                <Flex>
                    <Button type="link" onClick={() => handleShowDetail(record)}><EyeFilled /></Button>
                    <Button type="link" onClick={() => handleDelete(record)}><DeleteFilled /></Button>
                </Flex>

            }
        }


    ]

    return (
        <div className="costs-container">
            <div className="content-wrapper">
                {/* Breadcrumb */}
                <div className="page-header">
                    <div className="breadcrumb">
                        <HomeOutlined /> / รายงานการส่งออก / ใบวางบิล (ลูกค้า)
                    </div>
                    <Title level={4}>ใบวางบิล (ลูกค้า)</Title>
                </div>

                {/* Statistics Section */}
                <Row gutter={[16, 16]} className="mb-4">
                    <Col xs={24} sm={12} md={12}>
                        <Card className="stat-card">
                            <Statistic
                                title="รายการทั้งหมด"
                                value={'10'}
                                prefix={<BuildOutlined />}
                                suffix="รายการ"
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className="mb-4">
                    <Col xs={24} sm={24} md={24}>
                        <Card>
                            <Flex style={{ marginBottom: '24px' }} justify="space-between" alignItems="center">
                                <Title level={5} className='py-auto'>ใบวางบิลลูกค้า</Title>
                                <Button
                                    onClick={showModalForm}>เพิ่มใบวางบิล</Button>
                            </Flex>
                            <Table
                                columns={columns}
                                dataSource={[]}
                                rowKey="id"
                                pagination={false}
                                scroll={{ x: 800 }}
                            />
                        </Card>
                    </Col>
                </Row>

            </div>
            <Modal
                visible={showModal}
                onCancel={closeModalForm}
            >

                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item>

                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}

export default InvoiceCustomer