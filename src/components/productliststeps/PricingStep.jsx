import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, InputAdornment, Stack, Chip } from "@mui/material";
import PaymentsIcon from '@mui/icons-material/Payments';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import sellerApi from "../../api/sellerApi";

const PricingStep = ({ state, dispatch }) => {
  const [pricingData, setPricingData] = useState([]);
  const [bulkPricing, setBulkPricing] = useState({ mrp: "", discountType: "PERCENT", discountValue: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const data = (state.variants || []).map((v) => ({
      id: v.id || Math.random(),
      sku: v.sku,
      mrp: v.price?.mrp || 0,
      discountType: v.discount?.discountType || "PERCENT",
      discountValue: v.discount?.discountValue ?? 0,
      sellingPrice: v.price?.sellingPrice || 0,
    }));
    setPricingData(data);
  }, [state.variants]);

  // Auto-calculate selling price
  useEffect(() => {
    setPricingData((prev) =>
      prev.map((v) => {
        let sp = Number(v.mrp) || 0;
        const discount = Number(v.discountValue) || 0;
        if (v.discountType === "PERCENT") sp -= (sp * discount) / 100;
        else if (v.discountType === "FIXED") sp -= discount;
        return { ...v, sellingPrice: sp > 0 ? sp.toFixed(2) : 0 };
      })
    );
  }, [JSON.stringify(pricingData.map(v => ({ m: v.mrp, dt: v.discountType, dv: v.discountValue })))]);

  const handleChange = (variantId, field, value) => {
    setPricingData((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, [field]: value } : v))
    );
  };

  const applyBulk = () => {
    setPricingData((prev) =>
      prev.map((v) => ({
        ...v,
        mrp: bulkPricing.mrp || v.mrp,
        discountType: bulkPricing.discountType,
        discountValue: bulkPricing.discountValue || v.discountValue,
      }))
    );
  };

  // ✅ Save Pricing to backend & dispatch flag
  const savePricing = async () => {
    if (!state.productId) return;
    setSaving(true);

    try {
      for (const v of pricingData) {
        const mrp = Number(v.mrp) || 0;
        const discountValue = v.discountValue ?? 0;
        const sellingPrice = Number(v.sellingPrice) || mrp;

        await sellerApi.setVariantPrice(v.id, { mrp, sellingPrice });
        await sellerApi.setVariantDiscount(v.id, { discountType: v.discountType, discountValue });

        console.log(`Pricing saved for SKU ${v.sku}: MRP=${mrp}, Discount=${discountValue}, Selling=${sellingPrice}`);
      }

      // Update parent state
      dispatch({
        variants: state.variants.map((orig) => {
          const updated = pricingData.find((p) => p.sku === orig.sku);
          return updated
            ? {
                ...orig,
                price: { mrp: updated.mrp, sellingPrice: updated.sellingPrice },
                discount: { discountType: updated.discountType, discountValue: updated.discountValue }
              }
            : orig;
        }),
        pricingSaved: true, // ✅ Step completion flag
      });

    } catch (err) {
      console.error("Error saving pricing:", err);
      alert("Failed to save pricing. Check console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <PaymentsIcon sx={{ mr: 1 }} /> Pricing & Discounts
      </Typography>

      {/* Bulk Apply */}
      <Paper sx={{ p: 2, mb: 3, border: '1px dashed #D8B67B' }}>
        <Stack direction="row" spacing={2}>
          <TextField label="MRP" type="number" size="small" value={bulkPricing.mrp} onChange={e => setBulkPricing({...bulkPricing, mrp: e.target.value})} />
          <Select size="small" value={bulkPricing.discountType} onChange={e => setBulkPricing({...bulkPricing, discountType: e.target.value})}>
            <MenuItem value="PERCENT">%</MenuItem>
            <MenuItem value="FIXED">Fixed</MenuItem>
          </Select>
          <TextField label="Discount" type="number" size="small" value={bulkPricing.discountValue} onChange={e => setBulkPricing({...bulkPricing, discountValue: e.target.value})} />
          <Button onClick={applyBulk} variant="outlined">Apply</Button>
        </Stack>
      </Paper>

      {/* Pricing Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>MRP</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Final Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pricingData.map(v => (
              <TableRow key={v.id}>
                <TableCell>{v.sku}</TableCell>
                <TableCell>
                  <TextField type="number" size="small" value={v.mrp} onChange={e => handleChange(v.id, "mrp", e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <TextField type="number" size="small" value={v.discountValue} onChange={e => handleChange(v.id, "discountValue", e.target.value)} sx={{ width: 60 }} />
                    <Select size="small" value={v.discountType} onChange={e => handleChange(v.id, "discountType", e.target.value)}>
                      <MenuItem value="PERCENT">%</MenuItem>
                      <MenuItem value="FIXED">Flat</MenuItem>
                    </Select>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip label={`₹${v.sellingPrice}`} color="success" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button variant="contained" sx={{ mt: 3 }} onClick={savePricing} disabled={saving}>
        {saving ? "Saving..." : "Save Pricing"}
      </Button>
    </Box>
  );
};

export default PricingStep;
