CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
CREATE TABLE query (
    id uuid NOT NULL,
    creation_timestamp timestamp without time zone DEFAULT now() NOT NULL,
    query_json text
);

ALTER TABLE ONLY public.query
    ADD CONSTRAINT query_id_key UNIQUE (id);

CREATE UNIQUE INDEX query_json_sha256_idx ON public.query USING btree (public.digest(query_json, 'sha256'::text));
