import { useState } from 'react';

const initialFormState = {
  title: '',
  location: '',
  startTime: '',
  maxPlayers: '',
};

const CreateGameForm = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit?.(formData);
      setFormData(initialFormState);
    } catch (error) {
      // Let the parent component display the error message
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="md:col-span-1">
        <label htmlFor="game-title" className="block text-sm font-medium text-slate-200">
          Title
        </label>
        <input
          id="game-title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
          placeholder="Friday Night 5-a-side"
          required
        />
      </div>
      <div className="md:col-span-1">
        <label htmlFor="game-location" className="block text-sm font-medium text-slate-200">
          Location
        </label>
        <input
          id="game-location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleInputChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
          placeholder="Greenwood Park Turf"
          required
        />
      </div>
      <div>
        <label htmlFor="game-start" className="block text-sm font-medium text-slate-200">
          Kickoff time
        </label>
        <input
          id="game-start"
          name="startTime"
          type="datetime-local"
          value={formData.startTime}
          onChange={handleInputChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
          required
        />
      </div>
      <div>
        <label htmlFor="game-max-players" className="block text-sm font-medium text-slate-200">
          Maximum players
        </label>
        <input
          id="game-max-players"
          name="maxPlayers"
          type="number"
          min="1"
          value={formData.maxPlayers}
          onChange={handleInputChange}
          className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-pitch-500 focus:outline-none"
          placeholder="10"
        />
        <p className="mt-1 text-[11px] text-slate-500">Leave blank for unlimited spots.</p>
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-pitch-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-pitch-200 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400"
        >
          {isSubmitting ? 'Publishing…' : 'Publish game'}
        </button>
      </div>
    </form>
  );
};

export default CreateGameForm;
