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
        <label htmlFor="game-title" className="block text-sm font-medium text-quaternary-300">
          Title
        </label>
        <input
          id="game-title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          className="mt-1 w-full rounded-lg border border-tertiary-600 bg-secondary-700 px-3 py-2 text-accent-50 placeholder:text-quaternary-500 focus:border-pitch-500 focus:outline-none focus:ring-2 focus:ring-pitch-500/40"
          placeholder="Friday Night 5-a-side"
          required
        />
      </div>
      <div className="md:col-span-1">
        <label htmlFor="game-location" className="block text-sm font-medium text-quaternary-300">
          Location
        </label>
        <input
          id="game-location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleInputChange}
          className="mt-1 w-full rounded-lg border border-tertiary-600 bg-secondary-700 px-3 py-2 text-accent-50 placeholder:text-quaternary-500 focus:border-pitch-500 focus:outline-none focus:ring-2 focus:ring-pitch-500/40"
          placeholder="Greenwood Park Turf"
          required
        />
      </div>
      <div>
        <label htmlFor="game-start" className="block text-sm font-medium text-quaternary-300">
          Kickoff time
        </label>
        <input
          id="game-start"
          name="startTime"
          type="datetime-local"
          value={formData.startTime}
          onChange={handleInputChange}
          className="mt-1 w-full rounded-lg border border-tertiary-600 bg-secondary-700 px-3 py-2 text-accent-50 focus:border-pitch-500 focus:outline-none focus:ring-2 focus:ring-pitch-500/40"
          required
        />
      </div>
      <div>
        <label htmlFor="game-max-players" className="block text-sm font-medium text-quaternary-300">
          Maximum players
        </label>
        <input
          id="game-max-players"
          name="maxPlayers"
          type="number"
          min="1"
          value={formData.maxPlayers}
          onChange={handleInputChange}
          className="mt-1 w-full rounded-lg border border-tertiary-600 bg-secondary-700 px-3 py-2 text-accent-50 placeholder:text-quaternary-500 focus:border-pitch-500 focus:outline-none focus:ring-2 focus:ring-pitch-500/40"
          placeholder="10"
        />
        <p className="mt-1 text-[11px] text-quaternary-500">Leave blank for unlimited spots.</p>
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-pitch-500 px-4 py-2 text-sm font-semibold text-primary-800 transition hover:bg-pitch-400 active:bg-pitch-400 disabled:cursor-not-allowed disabled:bg-secondary-600 disabled:text-quaternary-500 touch-manipulation"
        >
          {isSubmitting ? 'Publishing…' : 'Publish game'}
        </button>
      </div>
    </form>
  );
};

export default CreateGameForm;
