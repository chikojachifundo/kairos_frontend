"use client";
import {useEffect, useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {ArrowLeft, Banknote, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {PageHeader} from "@/components/ui/page-header";
import {DisbursementForm} from "@/components/disbursements/disbursement-form";
import {disbursementService} from "@/services/disbursement-service";
import {clientService} from "@/services/client-service";
import {productService} from "@/services/product-service";
import {productChargeService} from "@/services/product-charge-service";
import {productChargeRecordService} from "@/services/product-charge-record-service";
import type {Disbursement} from "@/types/disbursement"; import type {Client} from "@/types/client"; import type {Product} from "@/types/product"; import type {ProductCharge} from "@/types/product-charge"; import type {ProductChargeRecord} from "@/types/product-charge-record";
export default function EditDisbursementPage() { const params = useParams<{id: string}>(); const id = Number(params.id); const [item,setItem]=useState<Disbursement|null>(null); const [data,setData]=useState<{clients:Client[];products:Product[];charges:ProductCharge[];records:ProductChargeRecord[]}|null>(null); const [loading,setLoading]=useState(true); useEffect(()=>{async function load(){try{const [d,c,p,cs,rs]=await Promise.all([disbursementService.getDisbursement(id),clientService.getClients(),productService.getProducts(),productChargeService.getProductCharges(),productChargeRecordService.getProductChargeRecords()]);setItem(d);setData({clients:c.data,products:p.data,charges:cs.data,records:rs.data});}catch(error){console.error(error);}finally{setLoading(false);}} if(id)load();else setLoading(false);},[id]); if(loading)return <div className="space-y-6"><PageHeader title="Edit Disbursement" description="Loading..." icon={Banknote}/><Loader2 className="h-7 w-7 animate-spin text-muted"/></div>; if(!item||item.status!=="pending")return <div className="space-y-6"><PageHeader title={item?"Disbursement Cannot Be Edited":"Disbursement Not Found"} description={item?"Only pending disbursements can be edited.":"The requested disbursement could not be found."} icon={Banknote}/><Button asChild variant="outline"><Link href={item?`/disbursements/${id}`:"/disbursements"}><ArrowLeft className="h-4 w-4"/>Back</Link></Button></div>; return <div className="space-y-6"><PageHeader title="Edit Disbursement" description={`Update ${item.disbursementNumber || `Disbursement #${item.id}`}.`} icon={Banknote}/>{data&&<DisbursementForm mode="edit" disbursement={item} clients={data.clients} products={data.products} productCharges={data.charges} productChargeRecords={data.records}/>}</div>; }
