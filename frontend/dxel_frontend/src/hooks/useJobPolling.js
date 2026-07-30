import { useState, useEffect, useRef } from "react";
import { fetchJobStatus } from "../services/meetingApi";

export function useJobPolling(jobId) {
    const [jobStatus, setJobStatus] = useState(null)
    const intervalRef = useRef(null)

    useEffect(() => {
        if(!jobId) return

        const poll = async () => {
            try {
                const data = await fetchJobStatus(jobId)
                setJobStatus(data)

                if(data.status === 'done' || data.status === 'failed')
                    clearInterval(intervalRef.current)
            } catch{
                clearInterval(intervalRef.current)
            }
        }

        poll()
        intervalRef.current = setInterval(poll, 2000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [jobId])

    return jobStatus
}