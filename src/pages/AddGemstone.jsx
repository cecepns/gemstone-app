// ANCHOR: AddGemstone Component - Uses shared GemstoneForm component
import GemstoneForm from '../components/GemstoneForm';

const AddGemstone = () => {
  return (
    <GemstoneForm
      mode="add"
      backPath="/admin/gemstones"
      backLabel="Kembali ke Daftar"
    />
  );
};

export default AddGemstone;
