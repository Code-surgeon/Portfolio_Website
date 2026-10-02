--
-- PostgreSQL database dump
--

\restrict gnQgHSUXx1YWjVKgtYaXjvINczGClgtdiEQkuJ6iyUyhIN7v8ySaoVg8Z5GRHuP

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-10-02 20:49:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 52174)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    linkedin_url text,
    github_url text,
    location character varying(150),
    bio_summary text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    my_name character varying(255),
    my_picture text
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 52173)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.admins ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 52215)
-- Name: experiences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.experiences (
    id integer NOT NULL,
    type character varying(50) NOT NULL,
    title character varying(200) NOT NULL,
    institution_or_company character varying(200) NOT NULL,
    location character varying(150),
    start_date character varying(50) NOT NULL,
    end_date character varying(50) NOT NULL,
    description text,
    display_order integer DEFAULT 0,
    CONSTRAINT experiences_type_check CHECK (((type)::text = ANY ((ARRAY['education'::character varying, 'experience'::character varying])::text[])))
);


ALTER TABLE public.experiences OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 52214)
-- Name: experiences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.experiences ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.experiences_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 52243)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_name character varying(150) NOT NULL,
    sender_email character varying(255) NOT NULL,
    message_body text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 52242)
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 52231)
-- Name: professional_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_activities (
    id integer NOT NULL,
    event_name character varying(200) NOT NULL,
    organization character varying(200) NOT NULL,
    date character varying(50),
    description text,
    certificate_url text,
    display_order integer DEFAULT 0
);


ALTER TABLE public.professional_activities OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 52230)
-- Name: professional_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.professional_activities ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.professional_activities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 52189)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    short_description character varying(300) NOT NULL,
    full_description text,
    problem_solved text,
    my_role character varying(150),
    tech_stack character varying(255) NOT NULL,
    github_url text,
    live_url text,
    video_url text,
    is_featured boolean DEFAULT false,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 52188)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.projects ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.projects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 224 (class 1259 OID 52204)
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    category character varying(100) NOT NULL,
    skill_name character varying(100) NOT NULL,
    status character varying(100) DEFAULT 'actively using'::character varying,
    display_order integer DEFAULT 0
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 52203)
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.skills ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.skills_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 5055 (class 0 OID 52174)
-- Dependencies: 220
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, username, password_hash, email, linkedin_url, github_url, location, bio_summary, created_at, updated_at, my_name, my_picture) FROM stdin;
1	mihlayokuphela	$2b$10$M2SZ5bbv7o0izyu09XgSw.WgavCyNX/1iB4JOSXpFfkF0M5uPNgtS	mihlayokuphela@gmail.com	https://www.linkedin.com/in/mihlayokuphela-thomo-9832b92ab	https://github.com/Code-surgeon	Johannesburg		2026-10-02 12:10:49.907856	2026-10-02 12:11:36.488145+02	Mihlayokuphela Thomo	/uploads/1790953065632-698879209.jpeg
\.


--
-- TOC entry 5061 (class 0 OID 52215)
-- Dependencies: 226
-- Data for Name: experiences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.experiences (id, type, title, institution_or_company, location, start_date, end_date, description, display_order) FROM stdin;
1	education	bsc Computer Science	University of Johannesburg	Johannesburg	February 2023	Present		0
\.


--
-- TOC entry 5065 (class 0 OID 52243)
-- Dependencies: 230
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_name, sender_email, message_body, is_read, created_at) FROM stdin;
\.


--
-- TOC entry 5063 (class 0 OID 52231)
-- Dependencies: 228
-- Data for Name: professional_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professional_activities (id, event_name, organization, date, description, certificate_url, display_order) FROM stdin;
\.


--
-- TOC entry 5057 (class 0 OID 52189)
-- Dependencies: 222
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, title, short_description, full_description, problem_solved, my_role, tech_stack, github_url, live_url, video_url, is_featured, display_order, created_at) FROM stdin;
3	asd	asd	\N	\N	\N	asd	\N	https://github.com/Code-surgeon/my-projects	https://www.youtube.com/watch?v=FOOf2AU9Jw0	f	0	2026-10-02 12:51:09.290888
\.


--
-- TOC entry 5059 (class 0 OID 52204)
-- Dependencies: 224
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.skills (id, category, skill_name, status, display_order) FROM stdin;
1	Frontend	REACT	actively using	0
2	backend	postgresql	actively using	0
\.


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 219
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 2, true);


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 225
-- Name: experiences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.experiences_id_seq', 1, true);


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 229
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 227
-- Name: professional_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professional_activities_id_seq', 1, false);


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 221
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 3, true);


--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 223
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 2, true);


--
-- TOC entry 4894 (class 2606 OID 52185)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 4896 (class 2606 OID 52187)
-- Name: admins admins_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_username_key UNIQUE (username);


--
-- TOC entry 4902 (class 2606 OID 52229)
-- Name: experiences experiences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.experiences
    ADD CONSTRAINT experiences_pkey PRIMARY KEY (id);


--
-- TOC entry 4906 (class 2606 OID 52255)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4904 (class 2606 OID 52241)
-- Name: professional_activities professional_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_activities
    ADD CONSTRAINT professional_activities_pkey PRIMARY KEY (id);


--
-- TOC entry 4898 (class 2606 OID 52202)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 4900 (class 2606 OID 52213)
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


-- Completed on 2026-10-02 20:49:48

--
-- PostgreSQL database dump complete
--

\unrestrict gnQgHSUXx1YWjVKgtYaXjvINczGClgtdiEQkuJ6iyUyhIN7v8ySaoVg8Z5GRHuP

