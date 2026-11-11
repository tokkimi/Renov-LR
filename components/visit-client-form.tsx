'use client';

import {useEffect, useRef, useState, type FormEvent} from 'react';
import {UserPlus, X} from 'lucide-react';
import AddressInput from './address-input';

export type VisitClientDetails = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
};

export default function VisitClientForm({onCreate, onClose}: {
  onCreate: (details: VisitClientDetails) => Promise<void>;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [address, setAddress] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  const dismiss = () => {
    if (!submitting.current) onClose();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    const fields = new FormData(event.currentTarget);
    const value = (key: string) => String(fields.get(key) ?? '').trim();
    const first_name = value('first_name');
    const last_name = value('last_name');
    if (!first_name || !last_name) {
      setError('Renseignez le prénom et le nom du client.');
      return;
    }

    if (!address.trim()) {
      setError('Renseignez l’adresse des travaux.');
      return;
    }

    submitting.current = true;
    setPending(true);
    setError('');
    try {
      await onCreate({
        first_name, last_name, email: value('email'), phone: value('phone'), address: address.trim(),
      });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'La fiche client n’a pas pu être enregistrée.');
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  return (
    <dialog className="app-dialog visit-client-dialog" ref={dialog} aria-labelledby="visit-client-title"
      onCancel={event => { event.preventDefault(); dismiss(); }}
      onClick={event => { if (event.target === event.currentTarget) dismiss(); }}>
      <header>
        <h2 id="visit-client-title">Nouveau client</h2>
        <button type="button" className="icon-button" aria-label="Fermer" disabled={pending} onClick={dismiss}><X/></button>
      </header>
      <form onSubmit={submit}>
        <p>Les coordonnées sont enregistrées dans la fiche client et reprises dans cette visite.</p>
        <div className="form-grid">
          <label>Prénom<input name="first_name" autoComplete="given-name" maxLength={80} required/></label>
          <label>Nom<input name="last_name" autoComplete="family-name" maxLength={80} required/></label>
        </div>
        <div className="form-grid">
          <label>Téléphone<input name="phone" type="tel" autoComplete="tel" maxLength={40}/></label>
          <label>Adresse e-mail<input name="email" type="email" autoComplete="email" maxLength={200} required/></label>
        </div>
        <AddressInput label="Adresse des travaux" value={address} onChange={setAddress}/>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn secondary" onClick={dismiss} disabled={pending}>Annuler</button>
          <button className="btn primary" disabled={pending}><UserPlus size={17}/>{pending ? 'Enregistrement…' : 'Créer le client et continuer'}</button>
        </div>
      </form>
    </dialog>
  );
}
