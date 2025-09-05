// ANCHOR: EditGemstone Component - Uses shared GemstoneForm component
import { useLocation, useParams } from 'react-router-dom';

import GemstoneForm from '../components/GemstoneForm';

const EditGemstone = () => {
  const { id } = useParams();
  const location = useLocation();

  // Determine back path and label based on navigation state
  const from = location.state?.from;
  const backPath = from === 'detail' ? `/admin/gemstones/${id}` : '/admin/gemstones';
  const backLabel = from === 'detail' ? 'Kembali ke Detail' : 'Kembali ke Daftar';

  return (
    <GemstoneForm
      mode="edit"
      gemstoneId={id}
      backPath={backPath}
      backLabel={backLabel}
    />
  );
};

export default EditGemstone;

