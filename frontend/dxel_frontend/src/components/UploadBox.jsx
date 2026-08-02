import styled from '@emotion/styled'
import { X, Upload, Mic, AlertTriangle, Hourglass, Check } from 'lucide-react'
import ProgressBar from './ProgressBar'
import { uploadFile } from '../services/meetingApi'
import { useJobPolling } from '../hooks/useJobPolling'
import { useState } from 'react'


const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(28, 27, 24, 0.42);
`

const ModalBox = styled.div`
    margin: 240px auto;
    padding: 36px 38px 32px;
    width: 680px;
    height: 800px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-radius: 22px;
    background-color: #FFFFFF;
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const ModalTitle = styled.p`
    font-size: 25px;
    color: #1C1B18;
    font-weight: 700;
`

const CloseButton = styled.button`
    width: 36px;
    height: 36px;
    background-color: #F3F1EA;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #7C766A;
`

const Drag = styled.div`
    border: 1.5px dashed #C9C3B5;
    background-color: #FAF9F5;
    border-radius: 16px;
    padding: 50px 24px 38px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    cursor: pointer;
    align-items: center;
`

const DragCircleIcon = styled.div`
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #EEF2F0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0F766E;
`

const DragText = styled.p`
    font-size: 19px;
    font-weight: 600;
    color: #1C1B18;
`

const DragSubText = styled.p`
    font-size: 15.5px;
    font-weight: 400;
    color: #7C766A;
`

const LinkText = styled.span`
    color: #0F766E;
    font-weight: 600;
    font-size: 15.5px;
`

const FileInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px 18px 16px;
    background-color: #FAF9F5;
    border: 1px solid #EBE7DF;
    border-radius: 13px;
`

const FileIconBack = styled.div`
    width: 46px;
    height: 46px;
    border-radius: 11px;
    background-color: #EEF2F0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0F766E;
    flex-shrink: 0;
`

const FileName = styled.p`
    font-size: 16.5px;
    font-weight: 600;
    color: #1C1B18;
`

const FileMeta = styled.p`
    font-size: 14px;
    color: #928C80;
`

const Warning = styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 12px 16px;
    background-color: #FBF3DF;
    border: 1px solid #EFDDB4;
    border-radius: 10px;
    font-size: 14.5px;
    color: #8A6312;
`

const WarningLink = styled.span`
    color: #6B4D0E;
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
    margin-left: auto;
    flex-shrink: 0;
`

const StepList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

const StepRow = styled.div`
    display: flex;
    align-items: center;
    gap: 13px;
`

const StepIcon = styled.div`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: ${props => props.$state === 'done' ? '#0F766E' : 'transparent'};
    border: ${props => props.$state === 'pending' ? '1.5px dotted #B3AB9C' : props.$state === 'active' ? '2.5px solid #0F766E' : 'none'};
    color: white;
`

const StepLabel = styled.p`
    width: 118px;
    flex-shrink: 0;
    font-size: 16px;
    color: ${props => props.$active ? '#1C1B18' : '#B0AB9D'};
    font-weight: ${props => props.$active ? '600' : '400'};
`

const StepPercent = styled.span`
    width: 44px;
    text-align: right;
    font-size: 14px;
    color: #7C766A;
    flex-shrink: 0;
`

const NoticeBox = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15.5px;
    color: #57534A;
    padding: 10px 13px;
    background-color: #F3F1EA;
    border-radius: 10px;
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`

const CancelButton = styled.button`
    padding: 12px 22px;
    color: #57534A;
    border: 1px solid #DDD8CD;
    border-radius: 10px;
    background-color: #FFFFFF;
    font-weight: 600;
    font-size: 15.5px;
    cursor: pointer;
`

const BackgroundButton = styled.button`
    background-color: #0F766E;
    color: #FFFFFF;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 15.5px;
    cursor: pointer;
`

const HiddenInput = styled.input`
    display: none;
`

function UploadBox({ onClose, onUploadComplete }) {
    const [file, setFile] = useState(null)
    const [jobId, setJobId] = useState(null)
    const [uploadError, setUploadError] = useState(null)
    const [duplicateInfo, setDuplicateInfo] = useState(null)
    const [fileBlob, setFileBlob] = useState(null)

    const jobStatus = useJobPolling(jobId)

    const handleFileSelect = async (e) => {
        const selected = e.target.files[0]
        if (selected) {
            setFile(selected)
            const buffer = await selected.arrayBuffer()
            setFileBlob({ buffer, name: selected.name, type: selected.type })
            await startUpload(selected)
        }
    }

    const handleDrop = async (e) => {
        e.preventDefault()
        const dropped = e.dataTransfer.files[0]
        if (dropped) {
            setFile(dropped)
            const buffer = await dropped.arrayBuffer()
            setFileBlob({ buffer, name: dropped.name, type: dropped.type })
            await startUpload(dropped)
        }
    }

    const startUpload = async (selectedFile, force = false) => {
        try {
            setUploadError(null)
            const result = await uploadFile(selectedFile, force)

            if (result.duplicate) {
                setDuplicateInfo(result)
                return
            }

            setDuplicateInfo(null)
            setJobId(result.job_id)
        } catch {
            setUploadError('파일 업로드에 실패했습니다.')
        }
    }

    const handleForceUpload = () => {
        if(fileBlob) {
            const rebuiltFile = new File([fileBlob.buffer], fileBlob.name, { type: fileBlob.type })
            startUpload(rebuiltFile, true)
        }
    }

    const getStepState = (step) => {
        if (!jobStatus) return 'pending'

        const stepOrder = ['transcribing', 'cleaning', 'summarizing', 'saving', 'completed']
        const currentIndex = stepOrder.indexOf(jobStatus.current_step)
        const thisIndex = stepOrder.indexOf(step)

        if (jobStatus.status === 'done') return 'done'
        if (thisIndex < currentIndex) return 'done'
        if (thisIndex === currentIndex) return 'active'

        return 'pending'
    }

    const formatSize = (bytes) => (bytes / 1024 / 1024).toFixed(1)

    const isProgressing = jobStatus && jobStatus.status !== 'done' && jobStatus.status !== 'failed'
    const isDone = jobStatus && jobStatus.status === 'done'

    const handleGoToBackground = async () => {
        if (onUploadComplete) {
            await onUploadComplete()
        }

        onClose()
    }

    const handleFinish = async () => {
        if (onUploadComplete) {
            await onUploadComplete()
        }

        onClose()
    }

    return (
        <Overlay onClick={onClose}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>새 회의 업로드</ModalTitle>
                    <CloseButton onClick={onClose}><X size={18} /></CloseButton>
                </ModalHeader>
                {!file ? (
                    <Drag
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('uploadFileInput').click()}
                    >
                        <DragCircleIcon>
                            <Upload size={24} />
                        </DragCircleIcon>
                        <DragText>녹음 파일을 끌어다 놓기</DragText>
                        <DragSubText>
                            또는 <LinkText>파일 선택</LinkText>
                        </DragSubText>
                        <HiddenInput
                            id="uploadFileInput"
                            type="file"
                            accept="audio/*,video/*"
                            onChange={handleFileSelect}
                        />
                    </Drag>
                ) : (
                    <>
                        <FileInfo>
                            <FileIconBack>
                                <Mic size={20} />
                            </FileIconBack>
                            <div>
                                <FileName>{file.name}</FileName>
                                <FileMeta>{formatSize(file.size)} MB</FileMeta>
                            </div>
                        </FileInfo>

                        {uploadError && (
                            <Warning>
                                <AlertTriangle size={17} />
                                {uploadError}
                            </Warning>
                        )}

                        {jobStatus && jobStatus.status === 'failed' && (
                            <Warning>
                                <AlertTriangle size={17} />
                                처리 중 오류가 발생했습니다: {jobStatus.error_message}
                            </Warning>
                        )}

                        {
                            duplicateInfo && (
                                <Warning>
                                    <AlertTriangle size={17} />
                                    같은 파일이 이미 있어요 - 중복일 수 있습니다
                                    <WarningLink onClick={handleForceUpload}>그래도 업로드</WarningLink>
                                </Warning>
                            )
                        }

                        {jobStatus && (
                            <StepList>
                                <StepRow>
                                    <StepIcon $state={getStepState('transcribing')}>
                                        {getStepState('transcribing') === 'done' && <Check size={15} />}
                                    </StepIcon>
                                    <StepLabel $active={getStepState('transcribing') !== 'pending'}>전사</StepLabel>
                                    <ProgressBar percent={
                                        getStepState('transcribing') === 'done' ? 100 :
                                            getStepState('transcribing') === 'active' ? jobStatus.progress : 0
                                    } />
                                    <StepPercent>
                                        {getStepState('transcribing') === 'done' ? 100 :
                                            getStepState('transcribing') === 'active' ? jobStatus.progress : 0}%
                                    </StepPercent>
                                </StepRow>

                                <StepRow>
                                    <StepIcon $state={getStepState('cleaning')}>
                                        {getStepState('cleaning') === 'done' && <Check size={15} />}
                                    </StepIcon>
                                    <StepLabel $active={getStepState('cleaning') !== 'pending'}>문장 정리</StepLabel>
                                    <ProgressBar percent={
                                        getStepState('cleaning') === 'done' ? 100 :
                                            getStepState('cleaning') === 'active' ? jobStatus.progress : 0
                                    } />
                                    <StepPercent>
                                        {getStepState('cleaning') === 'done' ? 100 :
                                            getStepState('cleaning') === 'active' ? jobStatus.progress : 0}%
                                    </StepPercent>
                                </StepRow>

                                <StepRow>
                                    <StepIcon $state={getStepState('summarizing')}>
                                        {getStepState('summarizing') === 'done' && <Check size={15} />}
                                    </StepIcon>
                                    <StepLabel $active={getStepState('summarizing') !== 'pending'}>요약·추출</StepLabel>
                                    <ProgressBar percent={
                                        getStepState('summarizing') === 'done' ? 100 :
                                            getStepState('summarizing') === 'active' ? jobStatus.progress : 0
                                    } />
                                    <StepPercent>
                                        {getStepState('summarizing') === 'done' ? 100 :
                                            getStepState('summarizing') === 'active' ? jobStatus.progress : 0}%
                                    </StepPercent>
                                </StepRow>

                                <StepRow>
                                    <StepIcon $state={getStepState('saving')}>
                                        {getStepState('saving') === 'done' && <Check size={15} />}
                                    </StepIcon>
                                    <StepLabel $active={getStepState('saving') !== 'pending'}>저장</StepLabel>
                                    <ProgressBar percent={
                                        getStepState('saving') === 'done' ? 100 :
                                            getStepState('saving') === 'active' ? jobStatus.progress : 0
                                    } />
                                    <StepPercent>
                                        {getStepState('saving') === 'done' ? 100 :
                                            getStepState('saving') === 'active' ? jobStatus.progress : 0}%
                                    </StepPercent>
                                </StepRow>
                            </StepList>
                        )}

                        {isProgressing && (
                            <NoticeBox>
                                <Hourglass size={16} />
                                <span>
                                    처리에 시간이 걸려요. <b>다른 화면을 봐도 백그라운드에서 계속</b>됩니다.
                                </span>
                            </NoticeBox>
                        )}

                        <ButtonBox>
                            {isDone ? (
                                <BackgroundButton onClick={handleFinish}>완료</BackgroundButton>
                            ) : (
                                <BackgroundButton onClick={handleGoToBackground}>백그라운드로</BackgroundButton>
                            )}
                        </ButtonBox>
                    </>
                )}
            </ModalBox>
        </Overlay>
    )
}

export default UploadBox