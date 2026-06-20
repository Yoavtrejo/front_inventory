import { ReactNode } from "react"

interface StatCardProps {
    icon: React.ReactNode
    titulo: string
    valor: number
    tendencia?: ReactNode
}

export function StatCard({ icon, titulo, valor, tendencia } : StatCardProps){
    return(
        <div className="box">
            <div className="is-flex is-justify-content-space-between">
                <span>{icon}</span>
                <span>{tendencia}</span>
            </div>
            <p>{titulo}</p>
            <p>{valor}</p>
        </div>
    )
}