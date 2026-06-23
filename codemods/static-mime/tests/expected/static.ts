import express from "express";
import mime from 'mime-types';

const jsonType = mime.lookup('json');

mime.charset('text/html');

const ext = mime.extension('application/json');

mime.define({ 'text/x-custom': ['cstm'] });
