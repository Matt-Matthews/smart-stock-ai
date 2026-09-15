import { defineStore } from 'pinia'

export const useReportStore = defineStore('reportStore', {
    state: () => ({
        reports: [] as any[]
    }),
    actions: {
        setReports(reports: any[]) {
            this.reports = reports
        },
        addReport(report: any) {
            this.reports.push(report)
        },
        updateReport(report: any) {
            const index = this.reports.findIndex(item => item.id === report.id)
            if (index !== -1) this.reports[index] = report
        },
        removeReport(reportId: string) {
            this.reports = this.reports.filter(report => report.id !== reportId)
        },
        clearStore() {
            this.$reset()
        }
    },
    persist: true
})