import { getLoanStatus, getLoanStatusStyle } from "../utils/loanStatus";
import type { MaterialLoan } from "../types";

export function LoanStatusBadge({ loan } : { loan: MaterialLoan }){
    const status = getLoanStatus(loan);
    const style = getLoanStatusStyle(status);

    return(
        <span style={{...style, fontFamily:'Poppins', padding:'0.2rem 0.75rem', borderRadius:'20px', fontSize:'0.78rem', fontWeight: 600}}>
            {status}
        </span>
    )
}