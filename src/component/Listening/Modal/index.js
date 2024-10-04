import React, {useState} from 'react';
import {Button, Col, Modal, Row, Select} from 'antd';

export const ModalListeningSetting = ({replay, timeReplay, setReplay, setTimeReplay}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const replayOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const timeReplayOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3];
    const showModal = () => {
        setIsModalOpen(true);
        setIsChange(false)
    };
    const handleCancel = () => {
        setIsModalOpen(false);

    };
    const handleChangeReplay = (value) => {
        setReplay(value)
        setIsChange(true)
    };
    const handleChangeTimeReplay = (value) => {
        setTimeReplay(value);
        setIsChange(true)

    };
    return (
        <>
            <Button type='default' size='large' className="mt-4"
                    onClick={showModal}
            >
                Settings
            </Button>
            <Modal title="Settings" open={isModalOpen} onCancel={handleCancel}
                   footer={(_) => (
                       <></>
                   )}>
                <Row>
                    <Col span={12}>
                        <p>Auto Replay</p>
                    </Col>
                    <Col span={12}>
                        <Select
                            defaultValue={replay}
                            style={{width: 120}}
                            onChange={handleChangeReplay}
                            options={replayOptions.map(el => {
                                return {
                                    label: el <= 1 ? el + ' time' : el + ' times',
                                    value: el + 1
                                }
                            })}
                        />
                    </Col>
                </Row>
                <Row className='mt-4'>
                    <Col span={12}>
                        <p>Time between replays</p>
                    </Col>
                    <Col span={12}>
                        <Select
                            defaultValue={timeReplay}
                            style={{width: 120}}
                            onChange={handleChangeTimeReplay}
                            options={timeReplayOptions.map(el => {
                                return {
                                    label: el + 's',
                                    value: el
                                }
                            })}
                        />
                    </Col>
                </Row>
                <p className="font-bold mt-10"
                   style={{color: 'green'}}>
                    {isChange && 'Settings have been saved!'}
                </p>
            </Modal>
        </>
    );
};
