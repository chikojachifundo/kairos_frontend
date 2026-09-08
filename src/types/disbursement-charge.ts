export type DisbursementChargeType =
    | "percentage"
    | "fixed-amount";

export interface DisbursementCharge {
    id: number;

    disbursementId: number;

    /**
     * Original product charge reference.
     * Kept for traceability only.
     */
    productChargeId: number;

    /**
     * Snapshot of the charge at the time
     * the disbursement was created.
     */
    code: string;
    name: string;
    type: DisbursementChargeType;

    /**
     * Original configured rate/value.
     *
     * Percentage:
     *   15 = 15%
     *
     * Fixed amount:
     *   5000 = MWK 5,000
     */
    rate: number;

    /**
     * Actual monetary amount charged
     * on this particular disbursement.
     */
    amount: number;

    description?: string;
}