import React, { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import axios from 'axios';
import {X} from "lucide-react";

const MediaManager = ({ setter, multiple = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [medias, setMedias] = useState([]);
    const [selectedMedias, setSelectedMedias] = useState([]);
    const [newMedia, setNewMedia] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (isOpen) {
            fetchMedias(currentPage);
        }
    }, [currentPage, isOpen]);

    const fetchMedias = async (page) => {
        try {
            const response = await axios.get(`/api/medias?page=${page}`);
            setMedias(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Erreur lors du chargement des médias:', error);
        }
    };

    const handleFileChange = (event) => {
        setNewMedia(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!newMedia) return;

        const formData = new FormData();
        formData.append('file', newMedia);

        try {
            const response = await axios.post('/api/medias', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMedias([response.data, ...medias]);
            setNewMedia(null);
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/medias/${id}`);
            setMedias(medias.filter(media => media.id !== id));
            setSelectedMedias(selectedMedias.filter(media => media.id !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handleSelect = (media) => {
        if (multiple) {
            setSelectedMedias(prev => {
                const isSelected = prev.some(m => m.id === media.id);
                if (isSelected) {
                    return prev.filter(m => m.id !== media.id);
                } else {
                    return [...prev, media];
                }
            });
        } else {
            setSelectedMedias([media]);
        }
    };

    const handleConfirm = () => {
        console.log(selectedMedias);
        if (selectedMedias.length > 0) {
            if (multiple) {
                setter(selectedMedias.map(media => media.path));
            } else {
                setter(selectedMedias[0].path);
            }
            setIsOpen(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Gérer les médias</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Gestionnaire de médias</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4">
                        {medias.map((media) => (
                            <div key={media.id} className="relative">
                                <img
                                    src={media.path}
                                    alt={media.name}
                                    className={`w-full h-full object-cover cursor-pointer rounded-2xl ${
                                        selectedMedias.some(m => m.id === media.id) ? 'border-2 border-primary' : ''
                                    }`}
                                    onClick={() => handleSelect(media)}
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-[-10px] right-[-10px] h-8 w-8"
                                    onClick={() => handleDelete(media.id)}
                                >
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <Button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Précédent
                        </Button>
                        <span>{currentPage} / {totalPages}</span>
                        <Button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Suivant
                        </Button>
                    </div>
                    <Input type="file" onChange={handleFileChange} />
                    <Button onClick={handleUpload} disabled={!newMedia}>
                        Uploader
                    </Button>
                    <Button onClick={handleConfirm} disabled={selectedMedias.length === 0}>
                        Confirmer la sélection ({selectedMedias.length})
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default MediaManager;
