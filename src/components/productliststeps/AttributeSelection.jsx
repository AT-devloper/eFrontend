import React, { useEffect, useState } from "react";
import { 
  Box, Typography, Chip, Button, Paper, Stack,
  IconButton, Tooltip
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StyleIcon from '@mui/icons-material/Style';
import sellerApi from "../../api/sellerApi";

const AttributeSelection = ({ state, dispatch }) => {
  const [attributes, setAttributes] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({});

  // Fetch all attributes
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const res = await sellerApi.getAllAttributes();
        setAttributes(res || []);
      } catch (err) {
        console.error("Failed to fetch attributes:", err);
      }
    };
    fetchAttributes();
  }, []);

  // Sync merged attributeSets to global attributes
  useEffect(() => {
    if (state.attributeSets?.length > 0) {
      const mergedAttrs = {};
      state.attributeSets.forEach((set) => {
        Object.entries(set).forEach(([attrId, valIds]) => {
          mergedAttrs[attrId] = Array.from(
            new Set([
              ...(mergedAttrs[attrId] || []),
              ...valIds.map((v) => (typeof v === "object" ? Number(v.id) : Number(v)))
            ])
          );
        });
      });
      dispatch({ attributes: mergedAttrs });
    } else {
      dispatch({ attributes: {} });
    }
  }, [state.attributeSets]);

  const handleSelect = (attrId, valId) => {
    setCurrentSelection((prev) => {
      const selected = prev[attrId] || [];
      const newSelected = selected.includes(valId)
        ? selected.filter((id) => id !== valId)
        : [...selected, valId];
      return { ...prev, [attrId]: newSelected };
    });
  };

  const addAttributeSet = () => {
    const hasSelection = Object.values(currentSelection).some((arr) => arr.length > 0);
    if (!hasSelection) return;

    const updatedSets = [...(state.attributeSets || []), currentSelection];
    dispatch({ attributeSets: updatedSets });
    setCurrentSelection({});
  };

  const removeAttributeSet = (index) => {
    const updated = [...state.attributeSets];
    updated.splice(index, 1);
    dispatch({ attributeSets: updated });
  };

  const getValueName = (attrId, valId) => {
    const attr = attributes.find((a) => a.id === parseInt(attrId));
    if (!attr) return valId;
    const val = attr.values.find((v) => v.id === valId);
    return val ? val.name : valId;
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <StyleIcon color="secondary" /> Attribute Configuration
      </Typography>

      {/* Attribute Selection Area */}
      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', mb: 4 }}>
        {attributes.map((attr) => (
          <Box key={attr.id} sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: 'primary.main' }}>
              {attr.name}
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {attr.values.map((val) => {
                const isSelected = (currentSelection[attr.id] || []).includes(val.id);
                return (
                  <Chip
                    key={`${attr.id}-${val.id}`}
                    label={val.name}
                    onClick={() => handleSelect(attr.id, val.id)}
                    color={isSelected ? "secondary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                    sx={{ 
                      borderRadius: '8px',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                  />
                );
              })}
            </Stack>
          </Box>
        ))}

        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={addAttributeSet}
          sx={{ 
            mt: 2, py: 1.5, 
            background: "linear-gradient(135deg, #D8B67B, #B5945B)",
            color: 'primary.main',
            fontWeight: 700
          }}
        >
          Define Attribute Set
        </Button>
      </Paper>

      {/* Displaying Saved Sets */}
      {state.attributeSets?.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Defined Sets
          </Typography>
          <Stack spacing={2}>
            {state.attributeSets.map((set, idx) => (
              <Paper 
                key={idx} 
                elevation={0}
                sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}
              >
                <Box>
                  {Object.entries(set).map(([attrId, valIds], sIdx) => (
                    <Typography key={attrId} variant="body2" component="span" sx={{ fontWeight: 600 }}>
                      {valIds.map((vId) => getValueName(attrId, vId)).join(", ")}
                      {sIdx < Object.entries(set).length - 1 ? " | " : ""}
                    </Typography>
                  ))}
                </Box>
                <Tooltip title="Remove Set">
                  <IconButton onClick={() => removeAttributeSet(idx)} color="error" size="small">
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AttributeSelection;
