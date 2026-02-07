import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InventoryIcon from '@mui/icons-material/Inventory';
import sellerApi from "../../api/sellerApi";

// SKU + Combinations
const generateSKU = (attributes, allAttributes) => {
  const parts = [];
  Object.entries(attributes).forEach(([attrId, valId]) => {
    const attr = allAttributes.find((a) => a.id === parseInt(attrId));
    const val = attr?.values.find((v) => v.id === valId);
    if (val) parts.push(val.name.slice(0, 3).toUpperCase());
  });
  return parts.join("-") || `SKU-${Math.random().toString(36).substr(2, 5)}`;
};

const generateCombinations = (attrSet) => {
  const entries = Object.entries(attrSet);
  if (!entries.length) return [];
  let combos = entries[0][1].map((val) => ({ [entries[0][0]]: val }));
  for (let i = 1; i < entries.length; i++) {
    const [attrId, valIds] = entries[i];
    const newCombos = [];
    combos.forEach((combo) => {
      valIds.forEach((valId) => newCombos.push({ ...combo, [attrId]: valId }));
    });
    combos = newCombos;
  }
  return combos;
};

const VariantStep = ({ state, dispatch }) => {
  const [allAttributes, setAllAttributes] = useState([]);
  const [groupedVariants, setGroupedVariants] = useState([]);

  useEffect(() => {
    const fetchAttrs = async () => {
      const res = await sellerApi.getAllAttributes();
      setAllAttributes(res);
    };
    fetchAttrs();
  }, []);

  useEffect(() => {
    if (!state.attributeSets?.length) return;
    const groups = state.attributeSets.map((set, setIdx) => {
      const combos = generateCombinations(set);
      return combos.map((combo) => ({
        combo,
        sku: generateSKU(combo, allAttributes),
        stock: 0,
        setIndex: setIdx
      }));
    });
    setGroupedVariants(groups);
  }, [state.attributeSets, allAttributes]);

  const handleStockChange = (setIdx, varIdx, value) => {
    const updatedGroups = [...groupedVariants];
    updatedGroups[setIdx][varIdx].stock = value;
    setGroupedVariants(updatedGroups);
  };

  const addVariants = async () => {
    try {
      const allToSave = groupedVariants.flat();
      const savedResults = [];
      
      for (const item of allToSave) {
        const payload = { sku: item.sku, stock: Number(item.stock) || 0, attributes: item.combo };
        if (state.productId) {
          const res = await sellerApi.createVariant(state.productId, payload);
          savedResults.push(res);
        } else {
          savedResults.push({ ...payload, id: Date.now() + Math.random() });
        }
      }

      // ✅ Save variants and set flag to allow "Next"
      dispatch({
        variants: [...(state.variants || []), ...savedResults],
        variantsSaved: true,
      });

      alert("All grouped variants saved!");
    } catch (err) { console.error(err); }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "primary.main", display: 'flex', alignItems: 'center' }}>
        <InventoryIcon sx={{ mr: 1 }} /> Stock Management
      </Typography>

      {groupedVariants.map((group, setIdx) => (
        <Accordion key={setIdx} defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight={600}>Attribute Set #{setIdx + 1}</Typography>
            <Chip label={`${group.length} Variants`} size="small" sx={{ ml: 2 }} />
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>SKU</TableCell>
                    <TableCell align="right">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.map((item, varIdx) => (
                    <TableRow key={varIdx}>
                      <TableCell><Chip label={item.sku} variant="outlined" size="small" /></TableCell>
                      <TableCell align="right">
                        <TextField 
                          type="number" size="small" value={item.stock} 
                          onChange={(e) => handleStockChange(setIdx, varIdx, e.target.value)}
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      <Button variant="contained" fullWidth onClick={addVariants} sx={{ mt: 3, py: 1.5 }}>
        Save All Inventory
      </Button>
    </Box>
  );
};

export default VariantStep;
